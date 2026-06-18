import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import CollaboratorForm from './collaborator-form'
import type { Collaborator } from './collaborator.types'

const initialCollaborators: Collaborator[] = [
	{
		id: 'col1',
		name: 'John Doe',
		email: 'john@example.com',
		role: 'Developer',
		phone: '+1 555 111 2222',
	},
	{
		id: 'col2',
		name: 'Jane Smith',
		email: 'jane@example.com',
		role: 'Designer',
	},
]

export default function CollaboratorRecordPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const [collaborators] = useState<Collaborator[]>(initialCollaborators)

	const collaborator = id ? collaborators.find((c) => c.id === id) : null

	function handleSubmit(data: Collaborator) {
		console.log('Collaborator data:', data)
		navigate('/collaborators')
	}

	return (
		<div className='p-4'>
			<CollaboratorForm
				initialData={collaborator ?? undefined}
				onSubmit={handleSubmit}
				onCancel={() => navigate('/collaborators')}
			/>
		</div>
	)
}
