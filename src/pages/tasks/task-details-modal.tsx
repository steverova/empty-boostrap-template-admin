import { Badge, Modal, Stack } from 'react-bootstrap'
import type { Task } from './task.types'

const priorityBg: Record<string, string> = {
	low: 'success',
	medium: 'warning',
	high: 'danger',
}

const statusLabel: Record<string, string> = {
	backlog: 'Backlog',
	todo: 'Todo',
	inprogress: 'In Progress',
	test: 'Testing',
	done: 'Done',
	cancelled: 'Cancelled',
}

const statusBg: Record<string, string> = {
	backlog: 'secondary',
	todo: 'info',
	inprogress: 'primary',
	test: 'warning',
	done: 'success',
	cancelled: 'danger',
}

type TaskDetailsModalProps = {
	task: Task | null
	show: boolean
	onHide: () => void
}

export default function TaskDetailsModal({ task, show, onHide }: TaskDetailsModalProps) {
	if (!task) return null

	return (
		<Modal show={show} onHide={onHide} size='lg' centered>
			<Modal.Header closeButton>
				<Modal.Title className='fw-semibold'>Task Details</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className='mb-3'>
					<h5 className='fw-semibold'>{task.title}</h5>
					<p className='text-muted mb-3'>{task.description}</p>
				</div>

				<Stack gap={3}>
					<div className='d-flex align-items-center gap-3'>
						<span className='fw-semibold' style={{ minWidth: 100 }}>Status:</span>
						<Badge bg={statusBg[task.status] ?? 'secondary'}>
							{statusLabel[task.status] ?? task.status}
						</Badge>
					</div>

					<div className='d-flex align-items-center gap-3'>
						<span className='fw-semibold' style={{ minWidth: 100 }}>Priority:</span>
						<Badge bg={priorityBg[task.priority] ?? 'secondary'}>
							{task.priority}
						</Badge>
					</div>

					{task.assignee && (
						<div className='d-flex align-items-center gap-3'>
							<span className='fw-semibold' style={{ minWidth: 100 }}>Assignee:</span>
							<span>{task.assignee}</span>
						</div>
					)}

					{task.project && (
						<div className='d-flex align-items-center gap-3'>
							<span className='fw-semibold' style={{ minWidth: 100 }}>Project:</span>
							<span>{task.project}</span>
						</div>
					)}

					{task.dueDate && (
						<div className='d-flex align-items-center gap-3'>
							<span className='fw-semibold' style={{ minWidth: 100 }}>Due Date:</span>
							<span>{task.dueDate}</span>
						</div>
					)}

					{task.members && task.members.length > 0 && (
						<div className='d-flex align-items-center gap-3'>
							<span className='fw-semibold' style={{ minWidth: 100 }}>Members:</span>
							<div className='d-flex gap-1'>
								{task.members.map((m) => (
									<Badge key={m} bg='secondary'>{m}</Badge>
								))}
							</div>
						</div>
					)}

					{task.reply && (
						<div className='border-top pt-3 mt-2'>
							<span className='fw-semibold d-block mb-2'>Reply:</span>
							<div className='bg-body-tertiary p-3 rounded'>
								{task.reply}
							</div>
						</div>
					)}
				</Stack>
			</Modal.Body>
			<Modal.Footer>
				<button type='button' className='btn btn-outline-secondary' onClick={onHide}>
					Close
				</button>
			</Modal.Footer>
		</Modal>
	)
}
