import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { mockClients, mockCollaborators, mockProjects } from '@/mocks'
import type { ProjectFormData } from './project.schema'
import ProjectForm from './project-form'

export function Component() {
	const { id } = useParams()
	const navigate = useNavigate()
	const [submitted, setSubmitted] = useState(false)

	const initialData = id ? mockProjects.find((p) => p.id === id) : undefined

	function handleSubmit(data: ProjectFormData) {
		console.log('Project data:', data)
		setSubmitted(true)
	}

	if (submitted) {
		return (
			<div className='p-4'>
				<div className='alert alert-success'>
					{id ? 'Project updated' : 'Project created'} successfully!
				</div>
				<button
					type='button'
					className='btn btn-outline-secondary mt-3'
					onClick={() => navigate('/projects')}
				>
					Back to Projects
				</button>
			</div>
		)
	}

	return (
		<div className='p-4'>
			<ProjectForm
				initialData={initialData}
				clients={mockClients}
				collaborators={mockCollaborators}
				onSubmit={handleSubmit}
				onCancel={() => navigate('/projects')}
			/>
		</div>
	)
}
