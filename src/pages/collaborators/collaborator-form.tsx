import { zodResolver } from '@hookform/resolvers/zod'
import { nanoid } from 'nanoid'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'
import { reactSelectStyles } from '@/components/shared/react-select-styles'
import { mockClients } from '@/mocks'
import {
	type CollaboratorFormData,
	collaboratorSchema,
} from './collaborator.schema'
import type { CollaboratorRole, CollaboratorType } from './collaborator.types'

const roleOptions: Array<{ value: CollaboratorRole; label: string }> = [
	{ value: 'developer', label: 'Developer' },
	{ value: 'qa', label: 'QA' },
	{ value: 'design', label: 'Design' },
	{ value: 'chief', label: 'Chief' },
	{ value: 'administrator', label: 'Administrator' },
]

const typeOptions: Array<{ value: CollaboratorType; label: string }> = [
	{ value: 'internal', label: 'Internal' },
	{ value: 'external', label: 'External' },
]

type CollaboratorFormProps = {
	initialData?: {
		id: string
		type: CollaboratorType
		clientId?: string
		firstName: string
		lastName: string
		email: string
		role: CollaboratorRole
		phone?: string
	}
	onSubmit: (data: CollaboratorFormData & { id: string }) => void
	onCancel?: () => void
}

export default function CollaboratorForm({
	initialData,
	onSubmit,
	onCancel,
}: CollaboratorFormProps) {
	const isEdit = !!initialData

	const {
		handleSubmit,
		control,
		formState: { errors },
		watch,
	} = useForm<CollaboratorFormData>({
		resolver: zodResolver(collaboratorSchema),
		defaultValues: {
			type: initialData?.type ?? 'internal',
			clientId: initialData?.clientId ?? '',
			firstName: initialData?.firstName ?? '',
			lastName: initialData?.lastName ?? '',
			email: initialData?.email ?? '',
			role: initialData?.role ?? 'developer',
			phone: initialData?.phone ?? '',
		},
	})

	const type = watch('type')

	function handleFormSubmit(data: CollaboratorFormData) {
		onSubmit({ ...data, id: initialData?.id ?? nanoid(10) })
	}

	return (
		<Card className='border-0 shadow-sm'>
			<Card.Header className='bg-body border-bottom'>
				<h5 className='mb-0 fw-semibold'>
					{isEdit ? 'Edit Collaborator' : 'New Collaborator'}
				</h5>
			</Card.Header>
			<Card.Body>
				<Form onSubmit={handleSubmit(handleFormSubmit)}>
					<Row className='mb-3'>
						<Col md={4}>
							<Form.Label className='fw-semibold'>Type</Form.Label>
							<Controller
								control={control}
								name='type'
								render={({ field }) => (
									<Select<{ value: CollaboratorType; label: string }>
										styles={reactSelectStyles as any}
										options={typeOptions}
										onChange={(val) => field.onChange(val?.value)}
										value={typeOptions.find((o) => o.value === field.value)}
										placeholder='Select type'
									/>
								)}
							/>
							{errors.type && (
								<small className='text-danger'>{errors.type.message}</small>
							)}
						</Col>
						<Col md={4}>
							<Form.Label className='fw-semibold'>Client</Form.Label>
							<Controller
								control={control}
								name='clientId'
								render={({ field }) => (
									<Select<{ value: string; label: string }>
										styles={reactSelectStyles as any}
										options={mockClients.map((c) => ({
											value: c.id,
											label: c.companyName
												? `${c.name} (${c.companyName})`
												: c.name,
										}))}
										onChange={(val) => field.onChange(val?.value)}
										value={mockClients
											.map((c) => ({
												value: c.id,
												label: c.companyName
													? `${c.name} (${c.companyName})`
													: c.name,
											}))
											.find((o) => o.value === field.value)}
										placeholder='Select client'
										isDisabled={type !== 'external'}
									/>
								)}
							/>
							{errors.clientId && (
								<small className='text-danger'>{errors.clientId.message}</small>
							)}
						</Col>
					</Row>

					<Row className='mb-3'>
						<Col md={6}>
							<Form.Label className='fw-semibold'>First Name</Form.Label>
							<Controller
								control={control}
								name='firstName'
								render={({ field }) => (
									<Form.Control
										{...field}
										isInvalid={!!errors.firstName}
										placeholder='John'
									/>
								)}
							/>
							{errors.firstName && (
								<Form.Control.Feedback type='invalid'>
									{errors.firstName.message}
								</Form.Control.Feedback>
							)}
						</Col>
						<Col md={6}>
							<Form.Label className='fw-semibold'>Last Name</Form.Label>
							<Controller
								control={control}
								name='lastName'
								render={({ field }) => (
									<Form.Control
										{...field}
										isInvalid={!!errors.lastName}
										placeholder='Doe'
									/>
								)}
							/>
							{errors.lastName && (
								<Form.Control.Feedback type='invalid'>
									{errors.lastName.message}
								</Form.Control.Feedback>
							)}
						</Col>
					</Row>

					<Row className='mb-3'>
						<Col md={6}>
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
						<Col md={6}>
							<Form.Label className='fw-semibold'>Role</Form.Label>
							<Controller
								control={control}
								name='role'
								render={({ field }) => (
									<Select<{ value: CollaboratorRole; label: string }>
										styles={reactSelectStyles as any}
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
									<Form.Control {...field} placeholder='+1 234 567 890' />
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
