import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { mockCollaborators } from '@/mocks'
import type { Collaborator } from './collaborator.types'
import CollaboratorForm from './collaborator-form'

export function Component() {
	const { id } = useParams()
	const navigate = useNavigate()
	const [collaborators] = useState<Collaborator[]>(mockCollaborators)

	const collaborator = id ? collaborators.find((c) => c.id === id) : null

	function handleSubmit(data: Collaborator) {
		console.log('Collaborator data:', data)
		navigate('/collaborators')
	}

	return (
		<div className=''>
			<CollaboratorForm
				initialData={collaborator ?? undefined}
				onSubmit={handleSubmit}
				onCancel={() => navigate('/collaborators')}
			/>
		</div>
	)
}
