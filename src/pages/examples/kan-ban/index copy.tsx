import type { DragEndEvent } from '@dnd-kit/core'
import {
	closestCenter,
	DndContext,
	KeyboardSensor,
	PointerSensor,
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
	{ id: 'newcolumn', title: 'New Column', icon: Plus, color: '#6f42c1' },
]

const initialTasks: Task[] = [
	{
		id: 'task-1',
		title: 'Design user authentication flow',
		description:
			'Create wireframes and mockups for the login and registration pages',
		priority: 'high',
		assignee: 'John Doe',
		dueDate: '2024-01-15',
	},
	{
		id: 'task-2',
		title: 'Implement API endpoints',
		description: 'Set up RESTful API endpoints for user management',
		priority: 'medium',
		assignee: 'Jane Smith',
		dueDate: '2024-01-20',
	},
	{
		id: 'task-3',
		title: 'Write unit tests',
		description: 'Create comprehensive test coverage for all new features',
		priority: 'low',
		assignee: 'Mike Johnson',
		dueDate: '2024-01-25',
	},
	{
		id: 'task-4',
		title: 'Setup CI/CD pipeline',
		description:
			'Configure GitHub Actions for automated testing and deployment',
		priority: 'high',
		assignee: 'Sarah Williams',
		dueDate: '2024-01-18',
	},
	{
		id: 'task-5',
		title: 'Update documentation',
		description: 'Document new API endpoints and usage examples',
		priority: 'medium',
		assignee: 'Tom Brown',
		dueDate: '2024-01-22',
	},
]

function SortableItem({ task }: { task: Task }) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: task.id })

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	}

	const getPriorityVariant = (priority: string) => {
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

	return (
		<Card
			ref={setNodeRef}
			style={style}
			className='mb-3 border-2 shadow-lg bg-body-tertiary'
			{...listeners}
			{...attributes}
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

export default function KanbanExamplePage() {
	const [tasks, setTasks] = useState<Task[]>(initialTasks)

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	)

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event

		if (over && active.id !== over.id) {
			setTasks((items) => {
				const oldIndex = items.findIndex((item) => item.id === active.id)
				const newIndex = items.findIndex((item) => item.id === over.id)

				return arrayMove(items, oldIndex, newIndex)
			})
		}
	}

	const tasksByColumn = columns.map((column) => {
		const columnTasks = tasks.filter((task) => {
			if (column.id === 'todo') return true
			if (column.id === 'inprogress') return task.id === 'task-1'
			if (column.id === 'test') return task.id === 'task-2'
			if (column.id === 'done')
				return task.id === 'task-3' || task.id === 'task-5'
			if (column.id === 'cancelled') return task.id === 'task-4'
			return false
		})

		return { column, tasks: columnTasks }
	})

	return (
		<div className='min-vh-100'>
			<Container fluid>
				<h1 className='py-1'>Kanban Board Example zzz</h1>
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
				>
					<div className=''>
						<Row className='flex-nowrap '>
							{tasksByColumn.map(({ column, tasks }) => {
								const Icon = column.icon
								return (
									<Col
										key={column.id}
										md={3}
										lg={3}
										className='mb-4 flex-shrink-0'
									>
										<Card className='border-0 shadow-sm h-100 '>
											<Card.Header className='d-flex justify-content-between align-items-center py-3'>
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
													{tasks.length}
												</Badge>
											</Card.Header>
											<Card.Body className='p-3' style={{ overflowY: 'auto' }}>
												<SortableContext
													items={tasks.map((task) => task.id)}
													strategy={verticalListSortingStrategy}
												>
													{tasks.map((task) => (
														<SortableItem key={task.id} task={task} />
													))}
												</SortableContext>
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
					</div>
				</DndContext>
			</Container>
		</div>
	)
}
