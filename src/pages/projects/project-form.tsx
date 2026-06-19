import { useCallback } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDropzone } from 'react-dropzone'
import Select from 'react-select'
import { Upload, X, FileText } from 'lucide-react'
import { Badge, Button, Card, Col, Form, Row } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import DatePicker from '@/components/shared/date-picker'
import { reactSelectStyles } from '@/components/shared/react-select-styles'
import { type ProjectFormData, projectSchema } from './project.schema'
import type { Project } from './project.types'
import type { Client } from '../clients/client.types'
import type { Collaborator } from '../collaborators/collaborator.types'

const statusOptions = [
	{ value: 'development', label: 'In Development' },
	{ value: 'active', label: 'Active' },
	{ value: 'maintenance', label: 'Maintenance' },
	{ value: 'completed', label: 'Completed' },
	{ value: 'inactive', label: 'Inactive' },
]

const priorityOptions = [
	{ value: 'low', label: 'Low' },
	{ value: 'medium', label: 'Medium' },
	{ value: 'high', label: 'High' },
]

type ProjectFormProps = {
	initialData?: Project
	clients: Client[]
	collaborators: Collaborator[]
	onSubmit: (data: ProjectFormData) => void
	onCancel?: () => void
}

export default function ProjectForm({ initialData, clients, collaborators, onSubmit, onCancel }: ProjectFormProps) {
	const isEdit = !!initialData

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		control,
		formState: { errors },
	} = useForm<ProjectFormData>({
		resolver: zodResolver(projectSchema),
		defaultValues: {
			projectName: initialData?.projectName ?? '',
			description: initialData?.description ?? '',
			status: initialData?.status ?? 'development',
			priority: initialData?.priority ?? 'medium',
			owner: initialData?.owner ?? '',
			startDate: initialData?.startDate ?? '',
			endDate: initialData?.endDate ?? '',
			team: initialData?.team ?? [],
			repository: initialData?.repository ?? '',
			demoUrl: initialData?.demoUrl ?? '',
			files: [],
		},
	})

	const files = watch('files')

	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			setValue('files', [...(files || []), ...acceptedFiles], { shouldValidate: true })
		},
		[files, setValue],
	)

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: { 'application/*': ['.pdf', '.doc', '.docx', '.txt'] },
	})

	function removeFile(index: number) {
		const updated = [...(files || [])]
		updated.splice(index, 1)
		setValue('files', updated, { shouldValidate: true })
	}

	return (
		<Card className='border-0 shadow-sm'>
			<Card.Header className='bg-body border-bottom'>
				<h5 className='mb-0 fw-semibold'>{isEdit ? 'Edit Project' : 'New Project'}</h5>
			</Card.Header>
			<Card.Body>
				<Form onSubmit={handleSubmit(onSubmit)}>
					<Row className='mb-3'>
						<Col md={4}>
							<Form.Label className='fw-semibold'>Project Name</Form.Label>
							<Form.Control
								{...register('projectName')}
								isInvalid={!!errors.projectName}
								placeholder='My Awesome Project'
							/>
							{errors.projectName && (
								<Form.Control.Feedback type='invalid'>
									{errors.projectName.message}
								</Form.Control.Feedback>
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
							/>
								)}
							/>
						</Col>
						<Col md={2}>
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
							/>
								)}
							/>
						</Col>
						<Col md={3}>
							<Form.Label className='fw-semibold'>Owner</Form.Label>
							<Controller
								control={control}
								name='owner'
								render={({ field }) => (
							<Select
								styles={reactSelectStyles}
								options={clients.map((c) => ({
									value: c.id,
									label: c.companyName ? `${c.name} (${c.companyName})` : c.name,
								}))}
								onChange={(val: any) => field.onChange(val?.value)}
								value={clients
									.map((c) => ({
										value: c.id,
										label: c.companyName ? `${c.name} (${c.companyName})` : c.name,
									}))
									.find((o) => o.value === field.value)}
								placeholder='Select owner'
							/>
								)}
							/>
							{errors.owner && (
								<small className='text-danger'>{errors.owner.message}</small>
							)}
						</Col>
					</Row>

					<Row className='mb-3'>
						<Col md={4}>
							<Form.Label className='fw-semibold'>Start Date</Form.Label>
							<Controller
								control={control}
								name='startDate'
								render={({ field }) => (
									<DatePicker
										value={field.value ? new Date(field.value) : null}
										onChange={(date) => field.onChange(date?.toISOString().split('T')[0] ?? '')}
										placeholder='Select start date'
									/>
								)}
							/>
							{errors.startDate && (
								<small className='text-danger'>{errors.startDate.message}</small>
							)}
						</Col>
						<Col md={4}>
							<Form.Label className='fw-semibold'>Estimated End Date</Form.Label>
							<Controller
								control={control}
								name='endDate'
								render={({ field }) => (
									<DatePicker
										value={field.value ? new Date(field.value) : null}
										onChange={(date) => field.onChange(date?.toISOString().split('T')[0] ?? '')}
										placeholder='Select end date'
									/>
								)}
							/>
							{errors.endDate && (
								<small className='text-danger'>{errors.endDate.message}</small>
							)}
						</Col>
						<Col md={4}>
							<Form.Label className='fw-semibold'>Team Members</Form.Label>
							<Controller
								control={control}
								name='team'
								render={({ field }) => (
							<Select
								styles={reactSelectStyles}
								isMulti
								options={collaborators.map((c) => ({
									value: c.id,
									label: c.name,
								}))}
								onChange={(vals: any) => field.onChange(vals?.map((v: any) => v.value) ?? [])}
								value={collaborators
									.map((c) => ({
										value: c.id,
										label: c.name,
									}))
									.filter((o) => field.value?.includes(o.value))}
								placeholder='Select team members'
							/>
								)}
							/>
							{errors.team && (
								<small className='text-danger d-block mb-1'>
									{errors.team.message}
								</small>
							)}
						</Col>
					</Row>

					<Form.Group className='mb-3'>
						<Form.Label className='fw-semibold'>Description</Form.Label>
						<Form.Control
							{...register('description')}
							as='textarea'
							rows={2}
							isInvalid={!!errors.description}
							placeholder='Brief description of the project...'
						/>
						{errors.description && (
							<Form.Control.Feedback type='invalid'>
								{errors.description.message}
							</Form.Control.Feedback>
						)}
					</Form.Group>

					<hr className='my-3' />

					<Row className='mb-3'>
						<Col md={6}>
							<Form.Label className='fw-semibold'>Repository URL</Form.Label>
							<Form.Control
								{...register('repository')}
								isInvalid={!!errors.repository}
								placeholder='https://github.com/org/repo'
							/>
						</Col>
						<Col md={6}>
							<Form.Label className='fw-semibold'>Demo URL</Form.Label>
							<Form.Control
								{...register('demoUrl')}
								isInvalid={!!errors.demoUrl}
								placeholder='https://demo.example.com'
							/>
						</Col>
					</Row>

					<Form.Group className='mb-3'>
						<Form.Label className='fw-semibold'>Documentation</Form.Label>
						<div
							{...getRootProps()}
							className={`border rounded p-3 text-center ${isDragActive ? 'border-primary bg-body-secondary' : 'border-secondary'}`}
							style={{ cursor: 'pointer' }}
						>
							<input {...getInputProps()} />
							<Upload size={24} className='text-muted mb-1' />
							<p className='mb-0 text-muted'>
								{isDragActive
									? 'Drop files here...'
									: 'Drag & drop files or click to browse'}
							</p>
						</div>
						{files && files.length > 0 && (
							<div className='mt-2 d-flex flex-wrap gap-1'>
								{files.map((file, i) => (
									<Badge
										key={i}
										bg='light'
										text='dark'
										className='d-flex align-items-center gap-1'
									>
										<FileText size={12} />
										{file.name}
										<X
											size={10}
											style={{ cursor: 'pointer' }}
											onClick={() => removeFile(i)}
										/>
									</Badge>
								))}
							</div>
						)}
					</Form.Group>

					<div className='d-flex justify-content-end gap-2'>
						{onCancel && (
							<Button variant='outline-secondary' onClick={onCancel}>
								Cancel
							</Button>
						)}
					<Button variant='primary' type='submit'>
						{isEdit ? 'Update Project' : 'Create Project'}
					</Button>
					</div>
				</Form>
			</Card.Body>
		</Card>
	)
}
