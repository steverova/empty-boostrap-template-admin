import { useCallback } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDropzone } from 'react-dropzone'
import Select from 'react-select'
import { Upload, X, FileText, Plus } from 'lucide-react'
import { Badge, Button, Card, Col, Form, Row } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import DatePicker from '@/components/shared/date-picker'
import { type ProjectFormData, projectSchema } from './project.schema'

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
	onSubmit: (data: ProjectFormData) => void
	onCancel?: () => void
}

export default function ProjectForm({ onSubmit, onCancel }: ProjectFormProps) {
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
			status: 'development',
			priority: 'medium',
			team: [],
			files: [],
		},
	})

	const team = watch('team')
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

	function addTeamMember(input: HTMLInputElement) {
		const value = input.value.trim()
		if (value && !team.includes(value)) {
			setValue('team', [...team, value], { shouldValidate: true })
			input.value = ''
		}
	}

	function removeTeamMember(member: string) {
		setValue('team', team.filter((m) => m !== member), { shouldValidate: true })
	}

	return (
		<Card className='border-0 shadow-sm'>
			<Card.Header className='bg-body border-bottom'>
				<h5 className='mb-0 fw-semibold'>New Project</h5>
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
										{...field}
										options={statusOptions}
										onChange={(val) => field.onChange(val?.value)}
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
										{...field}
										options={priorityOptions}
										onChange={(val) => field.onChange(val?.value)}
										value={priorityOptions.find((o) => o.value === field.value)}
									/>
								)}
							/>
						</Col>
						<Col md={3}>
							<Form.Label className='fw-semibold'>Owner</Form.Label>
							<Form.Control
								{...register('owner')}
								isInvalid={!!errors.owner}
								placeholder='Owner name'
							/>
							{errors.owner && (
								<Form.Control.Feedback type='invalid'>
									{errors.owner.message}
								</Form.Control.Feedback>
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
							<div className='d-flex gap-2 mb-2'>
								<Form.Control
									id='teamInput'
									placeholder='Add member + Enter'
									onKeyDown={(e) => {
										if (e.key === 'Enter') {
											e.preventDefault()
											addTeamMember(e.target as HTMLInputElement)
										}
									}}
								/>
								<Button
									variant='outline-secondary'
									onClick={() => {
										const input = document.getElementById('teamInput') as HTMLInputElement
										if (input) addTeamMember(input)
									}}
								>
									<Plus size={16} />
								</Button>
							</div>
							{errors.team && (
								<small className='text-danger d-block mb-1'>
									{errors.team.message}
								</small>
							)}
							<div className='d-flex flex-wrap gap-1'>
								{team.map((member) => (
									<Badge
										key={member}
										bg='primary'
										className='d-flex align-items-center gap-1'
									>
										{member}
										<X
											size={12}
											style={{ cursor: 'pointer' }}
											onClick={() => removeTeamMember(member)}
										/>
									</Badge>
								))}
							</div>
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
							Create Project
						</Button>
					</div>
				</Form>
			</Card.Body>
		</Card>
	)
}
