import { nanoid } from 'nanoid'
import { zodResolver } from '@hookform/resolvers/zod'
import Select from 'react-select'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import DatePicker from '@/components/shared/date-picker'
import { reactSelectStyles } from '@/components/shared/react-select-styles'
import { taskSchema } from './task.schema'
import TodoChecklist from './todo-checklist'
import type { Task } from './task.types'

const priorityOptions = [
	{ value: 'low', label: 'Low' },
	{ value: 'medium', label: 'Medium' },
	{ value: 'high', label: 'High' },
]

const statusOptions = [
	{ value: 'backlog', label: 'Backlog' },
	{ value: 'todo', label: 'Todo' },
	{ value: 'inprogress', label: 'In Progress' },
	{ value: 'test', label: 'Testing' },
	{ value: 'done', label: 'Done' },
	{ value: 'cancelled', label: 'Cancelled' },
]

type TaskFormProps = {
	initialData?: Task
	collaborators?: { id: string; name: string }[]
	projects?: { id: string; projectName: string }[]
	onSubmit: (data: Task) => void
	onCancel?: () => void
}

export default function TaskForm({ initialData, collaborators = [], projects = [], onSubmit, onCancel }: TaskFormProps) {
	const isEdit = !!initialData

	const {
		handleSubmit,
		control,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(taskSchema),
		defaultValues: {
			title: initialData?.title ?? '',
			description: initialData?.description ?? '',
			priority: initialData?.priority ?? 'medium',
			status: initialData?.status ?? 'backlog',
			assignee: initialData?.assignee ?? '',
			dueDate: initialData?.dueDate ?? '',
			project: initialData?.project ?? '',
			members: initialData?.members ?? [],
			todos: initialData?.todos ?? [],
		},
	})

	function handleFormSubmit(data: Record<string, unknown>) {
		onSubmit({ ...data, id: initialData?.id ?? nanoid(10) } as Task)
	}

	return (
		<Card className='border-0 shadow-sm'>
			<Card.Header className='bg-body border-bottom'>
				<h5 className='mb-0 fw-semibold'>{isEdit ? 'Edit Task' : 'New Task'}</h5>
			</Card.Header>
			<Card.Body>
				<Form onSubmit={handleSubmit(handleFormSubmit)}>
					<Row className='mb-3'>
						<Col md={6}>
							<Form.Label className='fw-semibold'>Title</Form.Label>
							<Controller
								control={control}
								name='title'
								render={({ field }) => (
									<Form.Control
										{...field}
										isInvalid={!!errors.title}
										placeholder='Task title'
									/>
								)}
							/>
							{errors.title && (
								<Form.Control.Feedback type='invalid'>
									{errors.title.message}
								</Form.Control.Feedback>
							)}
						</Col>
						<Col md={3}>
							<Form.Label className='fw-semibold'>Priority</Form.Label>
							<Controller
								control={control}
								name='priority'
								render={({ field }) => (
							<Select
								styles={reactSelectStyles}
								options={priorityOptions}
								onChange={(val: any) => field.onChange(val?.value)}
								value={priorityOptions.find((o) => o.value === field.value)}
								placeholder='Select priority'
							/>
								)}
							/>
							{errors.priority && (
								<small className='text-danger'>{errors.priority.message}</small>
							)}
						</Col>
						<Col md={3}>
							<Form.Label className='fw-semibold'>Status</Form.Label>
							<Controller
								control={control}
								name='status'
								render={({ field }) => (
							<Select
								styles={reactSelectStyles}
								options={statusOptions}
								onChange={(val: any) => field.onChange(val?.value)}
								value={statusOptions.find((o) => o.value === field.value)}
								placeholder='Select status'
							/>
								)}
							/>
							{errors.status && (
								<small className='text-danger'>{errors.status.message}</small>
							)}
						</Col>
					</Row>

					<Row className='mb-3'>
						<Col md={6}>
							<Form.Label className='fw-semibold'>Description</Form.Label>
							<Controller
								control={control}
								name='description'
								render={({ field }) => (
									<Form.Control
										{...field}
										as='textarea'
										rows={2}
										isInvalid={!!errors.description}
										placeholder='Task description...'
									/>
								)}
							/>
							{errors.description && (
								<Form.Control.Feedback type='invalid'>
									{errors.description.message}
								</Form.Control.Feedback>
							)}
						</Col>
						<Col md={3}>
							<Form.Label className='fw-semibold'>Assignee</Form.Label>
							<Controller
								control={control}
								name='assignee'
								render={({ field }) => (
							<Select
								styles={reactSelectStyles}
								options={collaborators.map((c) => ({
									value: c.id,
									label: c.name,
								}))}
								onChange={(val: any) => field.onChange(val?.value ?? '')}
								value={collaborators.find((c) => c.id === field.value)?.id ?? undefined}
								isClearable
								placeholder='Select assignee'
							/>
								)}
							/>
						</Col>
						<Col md={3}>
							<Form.Label className='fw-semibold'>Due Date</Form.Label>
							<Controller
								control={control}
								name='dueDate'
								render={({ field }) => (
									<DatePicker
										value={field.value ? new Date(field.value) : null}
										onChange={(date) => field.onChange(date?.toISOString().split('T')[0] ?? '')}
										placeholder='Select due date'
									/>
								)}
							/>
						</Col>
					</Row>

					<Row className='mb-3'>
						<Col md={6}>
							<Form.Label className='fw-semibold'>Project</Form.Label>
							<Controller
								control={control}
								name='project'
								render={({ field }) => (
							<Select
								styles={reactSelectStyles}
								options={projects.map((p) => ({
									value: p.projectName,
									label: p.projectName,
								}))}
								onChange={(val: any) => field.onChange(val?.value ?? '')}
								value={field.value ? { value: field.value, label: field.value } : null}
								isClearable
								placeholder='Select project'
							/>
								)}
							/>
						</Col>
					</Row>

					<hr className='my-3' />

					<Form.Group className='mb-3'>
						<Form.Label className='fw-semibold'>Checklist</Form.Label>
						<Controller
							control={control}
							name='todos'
							render={({ field }) => (
								<TodoChecklist value={field.value ?? []} onChange={(val: any) => field.onChange(val)} />
							)}
						/>
					</Form.Group>

					<div className='d-flex justify-content-end gap-2'>
						{onCancel && (
							<Button variant='outline-secondary' onClick={onCancel}>
								Cancel
							</Button>
						)}
						<Button variant='primary' type='submit'>
							{isEdit ? 'Update Task' : 'Create Task'}
						</Button>
					</div>
				</Form>
			</Card.Body>
		</Card>
	)
}
