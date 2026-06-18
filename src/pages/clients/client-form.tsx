import { nanoid } from 'nanoid'
import { zodResolver } from '@hookform/resolvers/zod'
import Select from 'react-select'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import { clientSchema, type ClientFormData } from './client.schema'
import type { Client } from './client.types'

const typeOptions = [
	{ value: 'individual', label: 'Individual' },
	{ value: 'company', label: 'Company' },
]

type ClientFormProps = {
	initialData?: Client
	onSubmit: (data: Client) => void
	onCancel?: () => void
}

export default function ClientForm({ initialData, onSubmit, onCancel }: ClientFormProps) {
	const isEdit = !!initialData

	const {
		register,
		handleSubmit,
		watch,
		control,
		formState: { errors },
	} = useForm<ClientFormData>({
		resolver: zodResolver(clientSchema),
		defaultValues: {
			type: initialData?.type ?? 'individual',
			name: initialData?.name ?? '',
			companyName: initialData?.companyName ?? '',
			phone: initialData?.phone ?? '',
			email: initialData?.email ?? '',
			address: initialData?.address ?? '',
			notes: initialData?.notes ?? '',
		},
	})

	const clientType = watch('type')

	function handleFormSubmit(data: ClientFormData) {
		onSubmit({ ...data, id: initialData?.id ?? nanoid(10) })
	}

	return (
		<Card className='border-0 shadow-sm'>
			<Card.Header className='bg-body border-bottom'>
				<h5 className='mb-0 fw-semibold'>{isEdit ? 'Edit Client' : 'New Client'}</h5>
			</Card.Header>
			<Card.Body>
				<Form onSubmit={handleSubmit(handleFormSubmit)}>
					<Row className='mb-3'>
						<Col md={3}>
							<Form.Label className='fw-semibold'>Type</Form.Label>
							<Controller
								control={control}
								name='type'
								render={({ field }) => (
									<Select
										{...field}
										options={typeOptions}
										onChange={(val) => field.onChange(val?.value)}
										value={typeOptions.find((o) => o.value === field.value)}
									/>
								)}
							/>
							{errors.type && (
								<small className='text-danger'>{errors.type.message}</small>
							)}
						</Col>
						<Col md={3}>
							<Form.Label className='fw-semibold'>Name</Form.Label>
							<Form.Control
								{...register('name')}
								isInvalid={!!errors.name}
								placeholder='John Doe'
							/>
							{errors.name && (
								<Form.Control.Feedback type='invalid'>
									{errors.name.message}
								</Form.Control.Feedback>
							)}
						</Col>
						{clientType === 'company' && (
							<Col md={3}>
								<Form.Label className='fw-semibold'>Company Name</Form.Label>
								<Form.Control
									{...register('companyName')}
									isInvalid={!!errors.companyName}
									placeholder='Acme Corp'
								/>
							</Col>
						)}
						<Col md={3}>
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

					<Form.Group className='mb-3'>
						<Form.Label className='fw-semibold'>Notes</Form.Label>
						<Form.Control
							{...register('notes')}
							as='textarea'
							rows={2}
							placeholder='Additional notes...'
						/>
					</Form.Group>

					<div className='d-flex justify-content-end gap-2'>
						{onCancel && (
							<Button variant='outline-secondary' onClick={onCancel}>
								Cancel
							</Button>
						)}
						<Button variant='primary' type='submit'>
							{isEdit ? 'Update Client' : 'Create Client'}
						</Button>
					</div>
				</Form>
			</Card.Body>
		</Card>
	)
}
