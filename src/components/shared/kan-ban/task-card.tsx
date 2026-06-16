import { Plus, RefreshCcw } from 'lucide-react'
import { Badge, Button, Card, Stack } from 'react-bootstrap'
import type { Task } from './kanban.types'
import { getPriorityVariant } from './kanban-helper'

export default function TaskCard({
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
				<div className='position-absolute top-0 end-0 px-2'>
					<RefreshCcw size={16} className='' />
				</div>

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
