import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import CollaboratorForm from './collaborator-form'
import type { Collaborator } from './collaborator.types'
import { mockCollaborators } from '@/mocks'

export default function CollaboratorRecordPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const [collaborators] = useState<Collaborator[]>(mockCollaborators)

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
