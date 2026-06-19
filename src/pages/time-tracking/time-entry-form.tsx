import { useMemo } from 'react'
import { nanoid } from 'nanoid'
import { zodResolver } from '@hookform/resolvers/zod'
import Select from 'react-select'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import DatePicker from '@/components/shared/date-picker'
import { reactSelectStyles } from '@/components/shared/react-select-styles'
import { timeEntrySchema, type TimeEntryFormData } from './time-entry.schema'
import type { TimeEntry } from './time-entry.types'
import type { Client } from '../clients/client.types'
import type { Project } from '../projects/project.types'
import type { Task } from '../tasks/task.types'
import type { Collaborator } from '../collaborators/collaborator.types'

const categoryOptions = [
	{ value: 'actividad_empresarial', label: 'Actividad Empresarial' },
	{ value: 'enfermedad', label: 'Enfermedad' },
	{ value: 'operacional', label: 'Operacional' },
	{ value: 'vacaciones', label: 'Vacaciones' },
]

const hourTypeOptions = [
	{ value: 'develop', label: 'Develop' },
	{ value: 'qa', label: 'QA' },
	{ value: 'design', label: 'Design' },
	{ value: 'mantenimiento', label: 'Mantenimiento' },
]

type TimeEntryFormProps = {
	initialData?: TimeEntry
	clients: Client[]
	projects: Project[]
	tasks: Task[]
	collaborators: Collaborator[]
	onSubmit: (data: TimeEntry) => void
	onCancel?: () => void
}

export default function TimeEntryForm({
	initialData,
	clients,
	projects,
	tasks,
	collaborators,
	onSubmit,
	onCancel,
}: TimeEntryFormProps) {
	const isEdit = !!initialData

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		control,
		formState: { errors },
	} = useForm<TimeEntryFormData>({
		resolver: zodResolver(timeEntrySchema),
		defaultValues: {
			category: initialData?.category ?? 'actividad_empresarial',
			day: initialData?.day ?? '',
			comment: initialData?.comment ?? '',
			hours: initialData?.hours ?? undefined,
			hourType: initialData?.hourType ?? undefined,
			collaboratorId: initialData?.collaboratorId ?? undefined,
			clientId: initialData?.clientId ?? undefined,
			projectId: initialData?.projectId ?? undefined,
			taskId: initialData?.taskId ?? undefined,
		},
	})

	const category = watch('category')
	const clientId = watch('clientId')
	const projectId = watch('projectId')
	const isOperational = category === 'operacional'

	const filteredProjects = useMemo(() => {
		if (!clientId) return projects
		return projects.filter((p) => p.owner === clientId)
	}, [clientId, projects])

	const filteredTasks = useMemo(() => {
		if (!projectId) return tasks
		return tasks.filter((t) => t.project === projectId)
	}, [projectId, tasks])

	function handleClientChange(val: { value: string; label: string } | null) {
		setValue('clientId', val?.value ?? '', { shouldValidate: true })
		setValue('projectId', '', { shouldValidate: true })
		setValue('taskId', '', { shouldValidate: true })
	}

	function handleProjectChange(val: { value: string; label: string } | null) {
		setValue('projectId', val?.value ?? '', { shouldValidate: true })
		setValue('taskId', '', { shouldValidate: true })
	}

	function handleFormSubmit(data: TimeEntryFormData) {
		onSubmit({ ...data, id: initialData?.id ?? nanoid(10) })
	}

	const collaboratorOptions = collaborators.map((c) => ({
		value: c.id,
		label: c.name,
	}))

	const clientOptions = clients.map((c) => ({
		value: c.id,
		label: c.companyName ? `${c.name} (${c.companyName})` : c.name,
	}))

	const projectOptions = filteredProjects.map((p) => ({
		value: p.id,
		label: p.projectName,
	}))

	const taskOptions = filteredTasks.map((t) => ({
		value: t.id,
		label: `${t.title} (#${t.id})`,
	}))

	return (
		<Card className='border-0 shadow-sm'>
			<Card.Header className='bg-body border-bottom'>
				<h5 className='mb-0 fw-semibold'>
					{isEdit ? 'Edit Time Entry' : 'New Time Entry'}
				</h5>
			</Card.Header>
			<Card.Body>
				<Form onSubmit={handleSubmit(handleFormSubmit)}>
					<Row className='mb-3'>
						<Col md={3}>
							<Form.Label className='fw-semibold'>Collaborator</Form.Label>
							<Controller
								control={control}
								name='collaboratorId'
								render={({ field }) => (
								<Select
									{...field}
									styles={reactSelectStyles}
									options={collaboratorOptions}
									onChange={(val) => field.onChange(val?.value ?? '')}
									value={collaboratorOptions.find((o) => o.value === field.value) ?? null}
									isClearable
									placeholder='Select collaborator...'
								/>
								)}
							/>
							{errors.collaboratorId && (
								<small className='text-danger'>{errors.collaboratorId.message}</small>
							)}
						</Col>
						<Col md={3}>
							<Form.Label className='fw-semibold'>Category</Form.Label>
							<Controller
								control={control}
								name='category'
								render={({ field }) => (
								<Select
									{...field}
									styles={reactSelectStyles}
									options={categoryOptions}
									onChange={(val) => field.onChange(val?.value)}
									value={categoryOptions.find((o) => o.value === field.value)}
									placeholder='Select category'
								/>
								)}
							/>
							{errors.category && (
								<small className='text-danger'>{errors.category.message}</small>
							)}
						</Col>
						<Col md={3}>
							<Form.Label className='fw-semibold'>Day</Form.Label>
							<Controller
								control={control}
								name='day'
								render={({ field }) => (
									<DatePicker
										value={field.value ? new Date(field.value) : null}
										onChange={(date) =>
											field.onChange(date?.toISOString().split('T')[0] ?? '')
										}
										placeholder='Select day'
									/>
								)}
							/>
							{errors.day && (
								<small className='text-danger'>{errors.day.message}</small>
							)}
						</Col>
					</Row>

					<Form.Group className='mb-3'>
						<Form.Label className='fw-semibold'>Comment</Form.Label>
						<Form.Control
							{...register('comment')}
							as='textarea'
							rows={2}
							isInvalid={!!errors.comment}
							placeholder='Describe your activity...'
						/>
						{errors.comment && (
							<Form.Control.Feedback type='invalid'>
								{errors.comment.message}
							</Form.Control.Feedback>
						)}
					</Form.Group>

					{isOperational && (
						<>
							<hr className='my-3' />
							<h6 className='fw-semibold mb-3'>Operational Details</h6>
							<Row className='mb-3'>
								<Col md={3}>
									<Form.Label className='fw-semibold'>Hours</Form.Label>
									<Form.Control
										{...register('hours', { valueAsNumber: true })}
										type='number'
										step='0.5'
										min='0'
										isInvalid={!!errors.hours}
										placeholder='0'
									/>
									{errors.hours && (
										<Form.Control.Feedback type='invalid'>
											{errors.hours.message}
										</Form.Control.Feedback>
									)}
								</Col>
								<Col md={3}>
									<Form.Label className='fw-semibold'>Hour Type</Form.Label>
									<Controller
										control={control}
										name='hourType'
										render={({ field }) => (
										<Select
											{...field}
											styles={reactSelectStyles}
											options={hourTypeOptions}
											onChange={(val) => field.onChange(val?.value)}
											value={hourTypeOptions.find((o) => o.value === field.value)}
											placeholder='Select type'
										/>
										)}
									/>
									{errors.hourType && (
										<small className='text-danger'>{errors.hourType.message}</small>
									)}
								</Col>
								<Col md={3}>
									<Form.Label className='fw-semibold'>Client</Form.Label>
									<Controller
										control={control}
										name='clientId'
										render={({ field }) => (
										<Select
											{...field}
											styles={reactSelectStyles}
											options={clientOptions}
											onChange={handleClientChange}
											value={clientOptions.find((o) => o.value === field.value) ?? null}
											isClearable
											placeholder='Search client...'
										/>
										)}
									/>
									{errors.clientId && (
										<small className='text-danger'>{errors.clientId.message}</small>
									)}
								</Col>
								<Col md={3}>
									<Form.Label className='fw-semibold'>Project</Form.Label>
									<Controller
										control={control}
										name='projectId'
										render={({ field }) => (
										<Select
											{...field}
											styles={reactSelectStyles}
											options={projectOptions}
											onChange={handleProjectChange}
											value={projectOptions.find((o) => o.value === field.value) ?? null}
											isClearable
											isDisabled={!clientId}
											placeholder={clientId ? 'Search project...' : 'Select client first'}
										/>
										)}
									/>
									{errors.projectId && (
										<small className='text-danger'>{errors.projectId.message}</small>
									)}
								</Col>
							</Row>
							<Row className='mb-3'>
								<Col md={4}>
									<Form.Label className='fw-semibold'>Task</Form.Label>
									<Controller
										control={control}
										name='taskId'
										render={({ field }) => (
										<Select
											{...field}
											styles={reactSelectStyles}
											options={taskOptions}
											onChange={(val) => field.onChange(val?.value ?? '')}
											value={taskOptions.find((o) => o.value === field.value) ?? null}
											isClearable
											isSearchable
											isDisabled={!projectId}
											placeholder={projectId ? 'Search task...' : 'Select project first'}
										/>
										)}
									/>
									{errors.taskId && (
										<small className='text-danger'>{errors.taskId.message}</small>
									)}
								</Col>
							</Row>
						</>
					)}

					<div className='d-flex justify-content-end gap-2'>
						{onCancel && (
							<Button variant='outline-secondary' onClick={onCancel}>
								Cancel
							</Button>
						)}
						<Button variant='primary' type='submit'>
							{isEdit ? 'Update Entry' : 'Create Entry'}
						</Button>
					</div>
				</Form>
			</Card.Body>
		</Card>
	)
}
