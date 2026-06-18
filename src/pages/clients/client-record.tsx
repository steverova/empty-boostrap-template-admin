import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import ClientForm from './client-form'
import type { Client } from './client.types'

const initialClients: Client[] = [
	{
		id: 'c1',
		type: 'company',
		name: 'Alice Chen',
		companyName: 'TechCorp',
		phone: '+1 555 123 4567',
		email: 'alice@techcorp.com',
		address: '100 Tech Ave, San Francisco, CA',
	},
	{
		id: 'c2',
		type: 'individual',
		name: 'Bob Williams',
		phone: '+1 555 987 6543',
		email: 'bob@mail.com',
		address: '200 Main St, Austin, TX',
	},
]

export default function ClientRecordPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const [clients] = useState<Client[]>(initialClients)

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
