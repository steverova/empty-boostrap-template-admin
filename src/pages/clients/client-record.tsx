import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import ClientForm from './client-form'
import type { Client } from './client.types'
import { mockClients } from '@/mocks'

export default function ClientRecordPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const [clients] = useState<Client[]>(mockClients)

	const client = id ? clients.find((c) => c.id === id) : null

	function handleSubmit(data: Client) {
		console.log('Client data:', data)
		navigate('/clients')
	}

	return (
		<div className='p-4'>
			<ClientForm
				initialData={client ?? undefined}
				onSubmit={handleSubmit}
				onCancel={() => navigate('/clients')}
			/>
		</div>
	)
}
