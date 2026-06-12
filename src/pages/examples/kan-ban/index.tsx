import type { DragEndEvent, DragOverEvent } from '@dnd-kit/core'
import {
	closestCenter,
	DndContext,
	DragOverlay,
	KeyboardSensor,
	PointerSensor,
	useDroppable,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
	AlertCircle,
	ArrowRight,
	CheckCircle,
	Clock,
	Plus,
	XCircle,
} from 'lucide-react'
import { useState } from 'react'
import {
	Badge,
	Button,
	Card,
	Col,
	Container,
	Row,
	Stack,
} from 'react-bootstrap'

interface Task {
	id: string
	title: string
	description: string
	priority: 'low' | 'medium' | 'high'
	assignee?: string
	dueDate?: string
	columnId: string
}

interface Column {
	id: string
	title: string
	icon: React.ComponentType<{ size?: number }>
	color: string
}

const columns: Column[] = [
	{ id: 'backlog', title: 'Backlog', icon: AlertCircle, color: '#6c757d' },
	{ id: 'todo', title: 'Todo', icon: Clock, color: '#007bff' },
	{
		id: 'inprogress',
		title: 'In Progress',
		icon: ArrowRight,
		color: '#17a2b8',
	},
	{ id: 'test', title: 'Testing', icon: AlertCircle, color: '#ffc107' },
	{ id: 'done', title: 'Done', icon: CheckCircle, color: '#28a745' },
	{ id: 'cancelled', title: 'Cancelled', icon: XCircle, color: '#dc3545' },
]

const initialTasks: Task[] = [
	{
		id: 'task-1',
		columnId: 'inprogress',
		title: 'Design user authentication flow',
		description:
			'Create wireframes and mockups for the login and registration pages',
		priority: 'high',
		assignee: 'John Doe',
		dueDate: '2024-01-15',
	},
	{
		id: 'task-2',
		columnId: 'inprogress',
		title: 'Implement API endpoints',
		description: 'Set up RESTful API endpoints for user management',
		priority: 'medium',
		assignee: 'Jane Smith',
		dueDate: '2024-01-20',
	},
	{
		id: 'task-3',
		columnId: 'inprogress',
		title: 'Write unit tests',
		description: 'Create comprehensive test coverage for all new features',
		priority: 'low',
		assignee: 'Mike Johnson',
		dueDate: '2024-01-25',
	},
	{
		id: 'task-4',
		columnId: 'inprogress',
		title: 'Setup CI/CD pipeline',
		description:
			'Configure GitHub Actions for automated testing and deployment',
		priority: 'high',
		assignee: 'Sarah Williams',
		dueDate: '2024-01-18',
	},
	{
		id: 'task-5',
		columnId: 'inprogress',
		title: 'Update documentation',
		description: 'Document new API endpoints and usage examples',
		priority: 'medium',
		assignee: 'Tom Brown',
		dueDate: '2024-01-22',
	},
]

// ─── Droppable column wrapper ────────────────────────────────────────────────

function DroppableColumn({
	columnId,
	children,
}: {
	columnId: string
	children: React.ReactNode
}) {
	const { setNodeRef, isOver } = useDroppable({ id: columnId })
	return (
		<div
			ref={setNodeRef}
			style={{
				minHeight: 80,
				borderRadius: 8,
				transition: 'background 0.15s',
				background: isOver ? 'rgba(0,0,0,0.04)' : 'transparent',
			}}
		>
			{children}
		</div>
	)
}

// ─── Sortable task card ───────────────────────────────────────────────────────

function getPriorityVariant(priority: string) {
	switch (priority) {
		case 'high':
			return 'danger'
		case 'medium':
			return 'warning'
		case 'low':
			return 'success'
		default:
			return 'secondary'
	}
}

function TaskCard({
	task,
	isDragging = false,
}: {
	task: Task
	isDragging?: boolean
}) {
	return (
		<Card
			className='mb-3 border-2 shadow-sm bg-body-tertiary'
			style={{ opacity: isDragging ? 0.5 : 1 }}
		>
			<Card.Body className='p-4'>
				<Card.Title className='h6 fw-semibold mb-2'>{task.title}</Card.Title>
				<Card.Text className='small text-muted mb-2'>
					{task.description}
				</Card.Text>
				<Stack direction='horizontal' gap={2} className='mb-2'>
					<Badge bg={getPriorityVariant(task.priority)}>{task.priority}</Badge>
					{task.assignee && (
						<small className='text-muted'>Assignee: {task.assignee}</small>
					)}
				</Stack>
				{task.dueDate && (
					<small className='text-muted d-block'>Due: {task.dueDate}</small>
				)}
				<div className='d-flex gap-2 mt-3'>
					<Button variant='outline-secondary' size='sm' className='flex-grow-1'>
						<Plus size={14} className='me-1' /> Edit
					</Button>
					<Button variant='primary' size='sm'>
						View Details
					</Button>
				</div>
			</Card.Body>
		</Card>
	)
}

function SortableItem({ task }: { task: Task }) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: task.id })

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	}

	return (
		<div ref={setNodeRef} style={style} {...listeners} {...attributes}>
			<TaskCard task={task} isDragging={isDragging} />
		</div>
	)
}

// ─── Main board ───────────────────────────────────────────────────────────────

export default function KanbanBoard() {
	const [tasks, setTasks] = useState<Task[]>(initialTasks)
	const [activeTask, setActiveTask] = useState<Task | null>(null)

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	)

	// Fired continuously while dragging — updates columnId on-the-fly so the
	// ghost card appears in the target column immediately.
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

				// Dropped over a column directly
				if (isOverColumn) {
					return { ...task, columnId: overId }
				}

				// Dropped over another task — adopt its columnId
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

		// Reorder within same column when dropped on a sibling task
		if (activeTask && overTask && activeTask.columnId === overTask.columnId) {
			setTasks((prev) => {
				const oldIndex = prev.findIndex((t) => t.id === activeId)
				const newIndex = prev.findIndex((t) => t.id === overId)
				return arrayMove(prev, oldIndex, newIndex)
			})
		}
	}

	const tasksByColumn = columns.map((column) => ({
		column,
		tasks: tasks.filter((t) => t.columnId === column.id),
	}))

	return (
		<div className='min-vh-100'>
			<Container fluid>
				<h1 className=''>Kanban Board</h1>
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
					<Row className='flex-nowrap g-2'>
						{tasksByColumn.map(({ column, tasks: columnTasks }) => {
							const Icon = column.icon
							return (
								<Col
                  key={column.id}
                  xs={11}
                  sm={9}
									md={6}
                  lg={4}
                  xxl={3}
									className='mb-4 flex-shrink-0  '
								>
									<Card className='border-0 shadow-sm h-100   '>
										<Card.Header className='d-flex justify-content-between align-items-center py-3 border'>
											<div className='d-flex align-items-center gap-2'>
												<div style={{ color: column.color }}>
													<Icon size={18} />
												</div>
												<Card.Title
													className='h6 mb-0 fw-semibold'
													style={{ color: column.color }}
												>
													{column.title}
												</Card.Title>
											</div>
											<Badge bg='light' text='dark' className='rounded-pill'>
												{columnTasks.length}
											</Badge>
										</Card.Header>
										<Card.Body className='p-3 border shadow ' style={{ overflowY: 'auto' }}>
											<DroppableColumn columnId={column.id}>
												<SortableContext
													items={columnTasks.map((t) => t.id)}
													strategy={verticalListSortingStrategy}
												>
													{columnTasks.map((task) => (
														<SortableItem key={task.id} task={task} />
													))}
												</SortableContext>
											</DroppableColumn>
											<Button
												variant='outline-secondary'
												className='w-100 mt-3'
												size='sm'
											>
												<Plus size={16} className='me-2' /> Add Task
											</Button>
										</Card.Body>
									</Card>
								</Col>
							)
						})}
					</Row>

					{/* Overlay card — renders the dragged card on top of everything */}
					<DragOverlay>
						{activeTask ? <TaskCard task={activeTask} /> : null}
					</DragOverlay>
				</DndContext>
			</Container>
		</div>
	)
}
