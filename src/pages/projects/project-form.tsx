import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, X } from 'lucide-react'
import { Badge, Button, Card, Col, Form, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { type ProjectFormData, projectSchema } from './project.schema'

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
		formState: { errors },
	} = useForm<ProjectFormData>({
		resolver: zodResolver(projectSchema),
		defaultValues: {
			type: 'individual',
			status: 'development',
			priority: 'medium',
			team: [],
		},
	})

	const projectType = watch('type')
	const team = watch('team')

	function addTeamMember(input: HTMLInputElement) {
		const value = input.value.trim()
		if (value && !team.includes(value)) {
			setValue('team', [...team, value], { shouldValidate: true })
			input.value = ''
		}
	}

	function removeTeamMember(member: string) {
		setValue(
			'team',
			team.filter((m) => m !== member),
			{ shouldValidate: true },
		)
	}

	return (
		<Card className='border-0 p-0'>
			<Card.Header className=''>
				<h5 className='mb-0 fw-semibold'>New Project</h5>
			</Card.Header>
			<Card.Body>
				<Form onSubmit={handleSubmit(onSubmit)}>
					{/* Contact Type */}
					<Row className='mb-3'>
						<Col md={6}>
							<Form.Label className='fw-semibold'>Contact Type</Form.Label>
							<Form.Select {...register('type')}>
								<option value='individual'>Individual</option>
								<option value='company'>Company</option>
							</Form.Select>
							{errors.type && (
								<small className='text-danger'>{errors.type.message}</small>
							)}
						</Col>
						{projectType === 'company' && (
							<Col md={6}>
								<Form.Label className='fw-semibold'>Company Name</Form.Label>
								<Form.Control
									{...register('companyName')}
									isInvalid={!!errors.companyName}
									placeholder='Acme Corp'
								/>
								{errors.companyName && (
									<Form.Control.Feedback type='invalid'>
										{errors.companyName.message}
									</Form.Control.Feedback>
								)}
							</Col>
						)}
					</Row>

					{/* Contact Info */}
					<Row className='mb-3'>
						<Col md={6}>
							<Form.Label className='fw-semibold'>Contact Name</Form.Label>
							<Form.Control
								{...register('contactName')}
								isInvalid={!!errors.contactName}
								placeholder='John Doe'
							/>
							{errors.contactName && (
								<Form.Control.Feedback type='invalid'>
									{errors.contactName.message}
								</Form.Control.Feedback>
							)}
						</Col>
						<Col md={6}>
							<Form.Label className='fw-semibold'>Phone</Form.Label>
							<Form.Control
								{...register('phone')}
								isInvalid={!!errors.phone}
								placeholder='+1 234 567 890'
							/>
							{errors.phone && (
								<Form.Control.Feedback type='invalid'>
									{errors.phone.message}
								</Form.Control.Feedback>
							)}
						</Col>
					</Row>

					<Row className='mb-3'>
						<Col md={6}>
							<Form.Label className='fw-semibold'>Email</Form.Label>
							<Form.Control
								{...register('email')}
								type='email'
								isInvalid={!!errors.email}
								placeholder='john@example.com'
							/>
							{errors.email && (
								<Form.Control.Feedback type='invalid'>
									{errors.email.message}
								</Form.Control.Feedback>
							)}
						</Col>
						<Col md={6}>
							<Form.Label className='fw-semibold'>Address</Form.Label>
							<Form.Control
								{...register('address')}
								isInvalid={!!errors.address}
								placeholder='123 Main St, City'
							/>
							{errors.address && (
								<Form.Control.Feedback type='invalid'>
									{errors.address.message}
								</Form.Control.Feedback>
							)}
						</Col>
					</Row>

					<hr className='my-4' />

					{/* Project Info */}
					<Row className='mb-3'>
						<Col md={6}>
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
							<Form.Select {...register('status')}>
								<option value='development'>In Development</option>
								<option value='active'>Active</option>
								<option value='maintenance'>Maintenance</option>
								<option value='completed'>Completed</option>
								<option value='inactive'>Inactive</option>
							</Form.Select>
						</Col>
						<Col md={3}>
							<Form.Label className='fw-semibold'>Priority</Form.Label>
							<Form.Select {...register('priority')}>
								<option value='low'>Low</option>
								<option value='medium'>Medium</option>
								<option value='high'>High</option>
							</Form.Select>
						</Col>
					</Row>

					<Row className='mb-3'>
						<Col md={6}>
							<Form.Label className='fw-semibold'>Start Date</Form.Label>
							<Form.Control
								{...register('startDate')}
								type='date'
								isInvalid={!!errors.startDate}
							/>
							{errors.startDate && (
								<Form.Control.Feedback type='invalid'>
									{errors.startDate.message}
								</Form.Control.Feedback>
							)}
						</Col>
						<Col md={6}>
							<Form.Label className='fw-semibold'>
								Estimated End Date
							</Form.Label>
							<Form.Control
								{...register('endDate')}
								type='date'
								isInvalid={!!errors.endDate}
							/>
							{errors.endDate && (
								<Form.Control.Feedback type='invalid'>
									{errors.endDate.message}
								</Form.Control.Feedback>
							)}
						</Col>
					</Row>

					<Form.Group className='mb-3'>
						<Form.Label className='fw-semibold'>Description</Form.Label>
						<Form.Control
							{...register('description')}
							as='textarea'
							rows={3}
							isInvalid={!!errors.description}
							placeholder='Brief description of the project...'
						/>
						{errors.description && (
							<Form.Control.Feedback type='invalid'>
								{errors.description.message}
							</Form.Control.Feedback>
						)}
					</Form.Group>

					<hr className='my-4' />

					{/* Links */}
					<Row className='mb-3'>
						<Col md={4}>
							<Form.Label className='fw-semibold'>Documentation URL</Form.Label>
							<Form.Control
								{...register('documentation')}
								isInvalid={!!errors.documentation}
								placeholder='https://docs.example.com'
							/>
							{errors.documentation && (
								<Form.Control.Feedback type='invalid'>
									{errors.documentation.message}
								</Form.Control.Feedback>
							)}
						</Col>
						<Col md={4}>
							<Form.Label className='fw-semibold'>Repository URL</Form.Label>
							<Form.Control
								{...register('repository')}
								isInvalid={!!errors.repository}
								placeholder='https://github.com/org/repo'
							/>
							{errors.repository && (
								<Form.Control.Feedback type='invalid'>
									{errors.repository.message}
								</Form.Control.Feedback>
							)}
						</Col>
						<Col md={4}>
							<Form.Label className='fw-semibold'>Demo URL</Form.Label>
							<Form.Control
								{...register('demoUrl')}
								isInvalid={!!errors.demoUrl}
								placeholder='https://demo.example.com'
							/>
							{errors.demoUrl && (
								<Form.Control.Feedback type='invalid'>
									{errors.demoUrl.message}
								</Form.Control.Feedback>
							)}
						</Col>
					</Row>

					<hr className='my-4' />

					{/* Owner & Team */}
					<Row className='mb-3'>
						<Col md={6}>
							<Form.Label className='fw-semibold'>Owner</Form.Label>
							<Form.Control
								{...register('owner')}
								isInvalid={!!errors.owner}
								placeholder='Project owner name'
							/>
							{errors.owner && (
								<Form.Control.Feedback type='invalid'>
									{errors.owner.message}
								</Form.Control.Feedback>
							)}
						</Col>
						<Col md={6}>
							<Form.Label className='fw-semibold'>Team Members</Form.Label>
							<div className='d-flex gap-2 mb-2'>
								<Form.Control
									id='teamInput'
									placeholder='Add member and press Enter'
									onKeyDown={(e) => {
										if (e.key === 'Enter') {
											e.preventDefault()
											addTeamMember(e.target as HTMLInputElement)
										}
									}}
								/>
								<Button
									variant='outline-secondary'
									size='sm'
									onClick={() => {
										const input = document.getElementById(
											'teamInput',
										) as HTMLInputElement
										if (input) addTeamMember(input)
									}}
								>
									<Plus size={16} />
								</Button>
							</div>
							{errors.team && (
								<small className='text-danger d-block mb-2'>
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

					<div className='d-flex justify-content-end gap-2 mt-4'>
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
