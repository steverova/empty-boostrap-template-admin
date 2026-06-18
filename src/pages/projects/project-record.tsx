import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import ProjectForm from './project-form'
import type { ProjectFormData } from './project.schema'
import type { Project } from './project.types'

const mockClients = [
	{
		id: 'cli1',
		name: 'Acme Corp',
		type: 'company' as const,
		companyName: 'Acme Corporation',
		contactPerson: 'Alice Johnson',
		email: 'alice@acme.com',
		phone: '+1 555 100 2000',
		address: '123 Main St, New York, NY',
	},
	{
		id: 'cli2',
		name: 'Bob Williams',
		type: 'individual' as const,
		email: 'bob@personal.dev',
		phone: '+1 555 300 4000',
	},
]

const mockCollaborators = [
	{
		id: 'col1',
		name: 'John Doe',
		email: 'john@example.com',
		role: 'developer' as const,
		phone: '+1 555 111 2222',
	},
	{
		id: 'col2',
		name: 'Jane Smith',
		email: 'jane@example.com',
		role: 'design' as const,
	},
]

const mockProjects: Project[] = [
	{
		id: 'proj1',
		projectName: 'E-Commerce Platform',
		description: 'Full stack e-commerce solution',
		startDate: '2026-01-15',
		endDate: '2026-06-30',
		status: 'active',
		priority: 'high',
		repository: 'https://github.com/acme/ecommerce',
		demoUrl: 'https://demo.acme.com',
		owner: 'cli1',
		team: ['col1', 'col2'],
	},
	{
		id: 'proj2',
		projectName: 'Mobile App Redesign',
		description: 'UI/UX overhaul for mobile app',
		startDate: '2026-03-01',
		endDate: '2026-08-15',
		status: 'development',
		priority: 'medium',
		repository: 'https://github.com/acme/mobile-redesign',
		demoUrl: '',
		owner: 'cli2',
		team: ['col2'],
	},
]

export default function ProjectRecordPage() {
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
