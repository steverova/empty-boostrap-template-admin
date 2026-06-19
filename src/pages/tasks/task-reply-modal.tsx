import { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import Select from 'react-select'
import Editor from '@/components/shared/editor'
import { reactSelectStyles } from '@/components/shared/react-select-styles'
import type { Task, TaskStatus } from './task.types'

const statusOptions = [
	{ value: 'backlog', label: 'Backlog' },
	{ value: 'todo', label: 'Todo' },
	{ value: 'inprogress', label: 'In Progress' },
	{ value: 'test', label: 'Testing' },
	{ value: 'done', label: 'Done' },
	{ value: 'cancelled', label: 'Cancelled' },
]

const DEFAULT_REPLY = `<p><strong>Fecha:</strong> </p>
<p><strong>Cliente:</strong> </p>
<p><strong>Número de ticket:</strong> </p>
<p><strong>Solicitud / Problema:</strong> </p>
<p><strong>Respuesta:</strong> </p>
<p><strong>Evidencias:</strong> (Adjuntar imágenes de evidencias si es necesario)</p>`

type TaskReplyModalProps = {
	task: Task | null
	show: boolean
	onHide: () => void
	onSubmit: (taskId: string, reply: string, status: TaskStatus) => void
}

export default function TaskReplyModal({ task, show, onHide, onSubmit }: TaskReplyModalProps) {
	const [reply, setReply] = useState(task?.reply ?? DEFAULT_REPLY)
	const [status, setStatus] = useState<TaskStatus>(task?.status ?? 'backlog')

	function handleSubmit() {
		if (!task) return
		onSubmit(task.id, reply, status)
		onHide()
	}

	return (
		<Modal show={show} onHide={onHide} size='xl' centered>
			<Modal.Header closeButton>
				<Modal.Title className='fw-semibold'>Reply to Task</Modal.Title>
			</Modal.Header>
			<Modal.Body style={{ minHeight: '50vh' }}>
				{task && (
					<>
						<div className='mb-3'>
							<small className='text-muted'>Task:</small>
							<div className='fw-semibold'>{task.title}</div>
						</div>

						<Form.Group className='mb-3'>
							<Form.Label className='fw-semibold'>Status</Form.Label>
							<Select
								styles={reactSelectStyles}
								options={statusOptions}
								value={statusOptions.find((o) => o.value === status)}
								onChange={(val: any) => setStatus((val?.value as TaskStatus) ?? 'backlog')}
								placeholder='Select status'
							/>
						</Form.Group>

						<Form.Group>
							<Form.Label className='fw-semibold'>Reply</Form.Label>
							<Editor
								initialContent={reply}
								onUpdate={(ed) => setReply(ed.getHTML())}
								placeholder='Enter your reply...'
								size='sm'
							/>
						</Form.Group>
					</>
				)}
			</Modal.Body>
			<Modal.Footer>
				<Button variant='outline-secondary' onClick={onHide}>
					Cancel
				</Button>
				<Button variant='primary' onClick={handleSubmit}>
					Submit Reply
				</Button>
			</Modal.Footer>
		</Modal>
	)
}
