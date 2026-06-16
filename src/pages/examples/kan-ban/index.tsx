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
import { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import CollapseCard from './collapse-card'
import ExpandedCard from './expanded-card'
import type { Task } from './kanban.types'
import { columns } from './kanban-helper'
import { initialTasks } from './kanban-mock'
import TaskCard from './task-card'

// ─── Main board ───────────────────────────────────────────────────────────────

export default function KanbanBoard() {
	const [tasks, setTasks] = useState<Task[]>(initialTasks)
	const [activeTask, setActiveTask] = useState<Task | null>(null)
	const [collapsedColumns, setCollapsedColumns] = useState<Set<string>>(
		new Set(),
	)

	const sensors = useSensors(
		useSensor(PointerSensor),
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

	const tasksByColumn = columns.map((column) => ({
		column,
		tasks: tasks.filter((t) => t.columnId === column.id),
	}))

	return (
    <div className='min-vh-100'>
			<Container fluid className='p-1'>
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
				<Row className='flex-nowrap g-2 align-items-stretch' style={{ height: '100vh', overflowX: 'auto', overflowY: 'hidden' }}>
					{tasksByColumn.map(({ column, tasks: columnTasks }) => {
						const isCollapsed = collapsedColumns.has(column.id)

						return (
							<Col
								key={column.id}
								{...(isCollapsed
									? {}
									: { xs: 11, sm: 9, md: 6, lg: 4, xxl: 3 })}
								className='flex-shrink-0 d-flex flex-column'
								style={
									isCollapsed
										? { width: 56, flex: '0 0 56px', padding: '0 4px', overflowY: 'auto', overflowX: 'hidden' }
										: { minWidth: 0, overflowY: 'auto', overflowX: 'hidden' }
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
										/>
									)}
								</Col>
							)
						})}
					</Row>

					<DragOverlay>
						{activeTask ? <TaskCard task={activeTask} /> : null}
					</DragOverlay>
				</DndContext>
			</Container>
		</div>
	)
}
