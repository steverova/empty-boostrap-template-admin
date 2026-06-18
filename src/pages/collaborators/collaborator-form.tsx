import { nanoid } from 'nanoid'
import { zodResolver } from '@hookform/resolvers/zod'
import Select from 'react-select'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import { collaboratorSchema, type CollaboratorFormData } from './collaborator.schema'
import { collaboratorRoles, type Collaborator } from './collaborator.types'

const roleOptions = collaboratorRoles.map((r) => ({
	value: r,
	label: r.charAt(0).toUpperCase() + r.slice(1),
}))

type CollaboratorFormProps = {
	initialData?: Collaborator
	onSubmit: (data: Collaborator) => void
	onCancel?: () => void
}

export default function CollaboratorForm({ initialData, onSubmit, onCancel }: CollaboratorFormProps) {
	const isEdit = !!initialData

	const {
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<CollaboratorFormData>({
		resolver: zodResolver(collaboratorSchema),
		defaultValues: {
			name: initialData?.name ?? '',
			email: initialData?.email ?? '',
			role: initialData?.role ?? undefined,
			phone: initialData?.phone ?? '',
		},
	})

	function handleFormSubmit(data: CollaboratorFormData) {
		onSubmit({ ...data, id: initialData?.id ?? nanoid(10) })
	}

	return (
		<Card className='border-0 shadow-sm'>
			<Card.Header className='bg-body border-bottom'>
				<h5 className='mb-0 fw-semibold'>{isEdit ? 'Edit Collaborator' : 'New Collaborator'}</h5>
			</Card.Header>
			<Card.Body>
				<Form onSubmit={handleSubmit(handleFormSubmit)}>
					<Row className='mb-3'>
						<Col md={4}>
							<Form.Label className='fw-semibold'>Name</Form.Label>
							<Controller
								control={control}
								name='name'
								render={({ field }) => (
									<Form.Control
										{...field}
										isInvalid={!!errors.name}
										placeholder='John Doe'
									/>
								)}
							/>
							{errors.name && (
								<Form.Control.Feedback type='invalid'>
									{errors.name.message}
								</Form.Control.Feedback>
							)}
						</Col>
						<Col md={4}>
							<Form.Label className='fw-semibold'>Email</Form.Label>
							<Controller
								control={control}
								name='email'
								render={({ field }) => (
									<Form.Control
										{...field}
										type='email'
										isInvalid={!!errors.email}
										placeholder='john@example.com'
									/>
								)}
							/>
							{errors.email && (
								<Form.Control.Feedback type='invalid'>
									{errors.email.message}
								</Form.Control.Feedback>
							)}
						</Col>
						<Col md={4}>
							<Form.Label className='fw-semibold'>Role</Form.Label>
							<Controller
								control={control}
								name='role'
								render={({ field }) => (
									<Select
										{...field}
										options={roleOptions}
										onChange={(val) => field.onChange(val?.value)}
										value={roleOptions.find((o) => o.value === field.value)}
										placeholder='Select role'
									/>
								)}
							/>
							{errors.role && (
								<small className='text-danger'>{errors.role.message}</small>
							)}
						</Col>
					</Row>

					<Row className='mb-3'>
						<Col md={4}>
							<Form.Label className='fw-semibold'>Phone</Form.Label>
							<Controller
								control={control}
								name='phone'
								render={({ field }) => (
									<Form.Control
										{...field}
										placeholder='+1 234 567 890'
									/>
								)}
							/>
						</Col>
					</Row>

					<div className='d-flex justify-content-end gap-2'>
						{onCancel && (
							<Button variant='outline-secondary' onClick={onCancel}>
								Cancel
							</Button>
						)}
						<Button variant='primary' type='submit'>
							{isEdit ? 'Update Collaborator' : 'Create Collaborator'}
						</Button>
					</div>
				</Form>
			</Card.Body>
		</Card>
	)
}
