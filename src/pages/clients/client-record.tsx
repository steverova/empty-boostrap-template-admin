import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { mockClients } from '@/mocks'
import type { Client } from './client.types'
import ClientForm from './client-form'

export function Component() {
	const { id } = useParams()
	const navigate = useNavigate()
	const [clients] = useState<Client[]>(mockClients)

	const client = id ? clients.find((c) => c.id === id) : null

	function handleSubmit(data: Client) {
		console.log('Client data:', data)
		navigate('/clients')
	}

	return (
		<ClientForm
			initialData={client ?? undefined}
			onSubmit={handleSubmit}
			onCancel={() => navigate('/clients')}
		/>
	)
}
