import { zodResolver } from '@hookform/resolvers/zod'
import { nanoid } from 'nanoid'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'
import CountrySelector, {
	ALL_COUNTRIES,
} from '@/components/shared/country-selector'
import { reactSelectStyles } from '@/components/shared/react-select-styles'
import { type ClientFormData, clientSchema } from './client.schema'
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

export default function ClientForm({
	initialData,
	onSubmit,
	onCancel,
}: ClientFormProps) {
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
			country: initialData?.country ?? '',
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
				<div className='d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3'>
					<h5 className='mb-0 fw-semibold'>
						{isEdit ? 'Edit Client' : 'New Client'}
					</h5>

					<div className='d-flex gap-2'>
						{onCancel && (
							<Button variant='outline-secondary' onClick={onCancel}>
								Cancel
							</Button>
						)}
						<Button variant='primary' type='submit'>
							{isEdit ? 'Update Client' : 'Create Client'}
						</Button>
					</div>
				</div>
			</Card.Header>
			<Card.Body>
				<Form onSubmit={handleSubmit(handleFormSubmit)}>
					<Row className='mb-3'>
						<Col md={2}>
							<Form.Label className='fw-semibold'>Type</Form.Label>
							<Controller
								control={control}
								name='type'
								render={({ field }) => (
									<Select
										styles={reactSelectStyles}
										options={typeOptions}
										onChange={(val: any) => field.onChange(val?.value)}
										value={typeOptions.find((o) => o.value === field.value)}
									/>
								)}
							/>
							{errors.type && (
								<small className='text-danger'>{errors.type.message}</small>
							)}
						</Col>
						<Col md={5}>
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
						<Col md={5}>
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

					{clientType === 'company' && (
						<Row className='mb-3'>
							<Col md={12}>
								<Form.Label className='fw-semibold'>Company Name</Form.Label>
								<Form.Control
									{...register('companyName')}
									isInvalid={!!errors.companyName}
									placeholder='Acme Corp'
								/>
							</Col>
						</Row>
					)}

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
							<Form.Label className='fw-semibold'>Country</Form.Label>
							<Controller
								control={control}
								name='country'
								render={({ field: { onChange, value } }) => {
									const selectedCountry = ALL_COUNTRIES.find(
										(c) => c.code === value,
									)
									return (
										<CountrySelector
											showFlag
											showCode
											placeholder='Select country'
											onChange={(val) => onChange(val?.code ?? '')}
											value={selectedCountry ?? null}
										/>
									)
								}}
							/>
							{errors.country && (
								<small className='text-danger'>{errors.country.message}</small>
							)}
						</Col>
					</Row>

					<Row className='mb-3'>
						<Col md={12}>
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
				</Form>
			</Card.Body>
		</Card>
	)
}
