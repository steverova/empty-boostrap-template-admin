import type { DragEndEvent, DragOverEvent } from '@dnd-kit/core'
import {
	closestCenter,
	DndContext,
	DragOverlay,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useMemo, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import CollapseCard from './collapse-card'
import ExpandedCard from './expanded-card'
import type { Task } from './kanban.types'
import { columns } from './kanban-helper'
import { initialTasks } from './kanban-mock'
import KanbanToolbar, { type KanbanFilters } from './kanban-toolbar'
import TaskCard from './task-card'
import TaskDetailsModal from '@/pages/tasks/task-details-modal'
import TaskReplyModal from '@/pages/tasks/task-reply-modal'

// ─── Main board ───────────────────────────────────────────────────────────────

export default function KanbanBoard() {
	const [tasks, setTasks] = useState<Task[]>(initialTasks)
	const [activeTask, setActiveTask] = useState<Task | null>(null)
	const [collapsedColumns, setCollapsedColumns] = useState<Set<string>>(
		new Set(),
	)
	const [filters, setFilters] = useState<KanbanFilters>({
		search: '',
		priority: '',
		assignee: '',
		project: '',
	})
	const [selectedTask, setSelectedTask] = useState<Task | null>(null)
	const [showDetails, setShowDetails] = useState(false)
	const [showReply, setShowReply] = useState(false)

	function handleDetails(task: Task) {
		setSelectedTask(task)
		setShowDetails(true)
	}

	function handleReply(task: Task) {
		setSelectedTask(task)
		setShowReply(true)
	}

	function handleSubmitReply(taskId: string, reply: string, status: string) {
		setTasks((prev) =>
			prev.map((t) => (t.id === taskId ? { ...t, reply, columnId: status } : t)),
		)
	}

	const assignees = useMemo(
		() =>
			[...new Set(tasks.map((t) => t.assignee).filter(Boolean))] as string[],
		[tasks],
	)
	const projects = useMemo(
		() => [...new Set(tasks.map((t) => t.project).filter(Boolean))] as string[],
		[tasks],
	)

	const filteredTasks = useMemo(() => {
		return tasks.filter((t) => {
			if (
				filters.search &&
				!t.title.toLowerCase().includes(filters.search.toLowerCase())
			)
				return false
			if (filters.priority && t.priority !== filters.priority) return false
			if (filters.assignee && t.assignee !== filters.assignee) return false
			if (filters.project && t.project !== filters.project) return false
			return true
		})
	}, [tasks, filters])

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 10,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	)

	function handleDragOver(event: DragOverEvent) {
		const { active, over } = event
		if (!over) return
		const activeId = active.id as string
		const overId = over.id as string
		if (activeId === overId) return
		const isOverColumn = columns.some((c) => c.id === overId)
		const overTask = tasks.find((t) => t.id === overId)
		setTasks((prev) => {
			return prev.map((task) => {
				if (task.id !== activeId) return task
				if (isOverColumn) {
					return { ...task, columnId: overId }
				}
				if (overTask) {
					return { ...task, columnId: overTask.columnId }
				}
				return task
			})
		})
	}

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event
		setActiveTask(null)

		if (!over) return

		const activeId = active.id as string
		const overId = over.id as string

		if (activeId === overId) return

		const activeTask = tasks.find((t) => t.id === activeId)
		const overTask = tasks.find((t) => t.id === overId)

		if (activeTask && overTask && activeTask.columnId === overTask.columnId) {
			setTasks((prev) => {
				const oldIndex = prev.findIndex((t) => t.id === activeId)
				const newIndex = prev.findIndex((t) => t.id === overId)
				return arrayMove(prev, oldIndex, newIndex)
			})
		}
	}

	function handleCollapse(columnId: string) {
		setCollapsedColumns((prev) => {
			const next = new Set(prev)
			if (next.has(columnId)) {
				next.delete(columnId)
			} else {
				next.add(columnId)
			}
			return next
		})
	}

	function handleMove(taskId: string, targetColumnId: string) {
		setTasks((prev) =>
			prev.map((t) =>
				t.id === taskId ? { ...t, columnId: targetColumnId } : t,
			),
		)
	}

	const tasksByColumn = columns.map((column) => ({
		column,
		tasks: filteredTasks.filter((t) => t.columnId === column.id),
	}))

	return (
		<div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
			<Container
				fluid
				className='p-1'
				style={{
					flex: 1,
					display: 'flex',
					flexDirection: 'column',
					minHeight: 0,
				}}
			>
				<KanbanToolbar
					filters={filters}
					assignees={assignees}
					projects={projects}
					onChange={setFilters}
				/>

				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragStart={(e) => {
						const task = tasks.find((t) => t.id === e.active.id)
						setActiveTask(task ?? null)
					}}
					onDragOver={handleDragOver}
					onDragEnd={handleDragEnd}
				>
					<Row
						className='flex-nowrap g-2 align-items-stretch'
						style={{ flex: 1, overflowX: 'auto', minHeight: 0 }}
					>
						{tasksByColumn.map(({ column, tasks: columnTasks }) => {
							const isCollapsed = collapsedColumns.has(column.id)

							return (
								<Col
									key={column.id}
									{...(isCollapsed
										? {}
										: { xs: 9, sm: 9, md: 6, lg: 4, xxl: 3 })}
									className='flex-shrink-0 d-flex flex-column'
									style={
										isCollapsed
											? {
													width: 56,
													flex: '0 0 56px',
													padding: '0 4px',
													overflow: 'hidden',
												}
											: { minWidth: 0, overflow: 'hidden' }
									}
								>
									{isCollapsed ? (
										// ── Vista colapsada: columna vertical angosta ──
										<CollapseCard
											column={column}
											columnTasks={columnTasks}
											handleCollapse={handleCollapse}
										/>
									) : (
									// ── Vista expandida normal ──
									<ExpandedCard
										icon={column.icon}
										handleCollapse={handleCollapse}
										column={column}
										columnTasks={columnTasks}
										onMove={handleMove}
										onDetails={handleDetails}
										onReply={handleReply}
									/>
									)}
								</Col>
							)
						})}
					</Row>

					<DragOverlay>
						{activeTask ? <TaskCard task={activeTask} isDragging /> : null}
					</DragOverlay>
				</DndContext>
			</Container>

			<TaskDetailsModal
				task={selectedTask as any}
				show={showDetails}
				onHide={() => setShowDetails(false)}
			/>

			<TaskReplyModal
				task={selectedTask as any}
				show={showReply}
				onHide={() => setShowReply(false)}
				onSubmit={handleSubmitReply}
			/>
		</div>
	)
}
