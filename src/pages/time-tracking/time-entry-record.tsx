import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import TimeEntryForm from './time-entry-form'
import type { TimeEntry } from './time-entry.types'
import type { Client } from '../clients/client.types'
import type { Project } from '../projects/project.types'
import type { Task } from '../tasks/task.types'

const mockClients: Client[] = [
	{
		id: 'cli1',
		type: 'company',
		name: 'Alice Chen',
		companyName: 'TechCorp',
		phone: '+1 555 123 4567',
		email: 'alice@techcorp.com',
		address: '100 Tech Ave, San Francisco, CA',
	},
	{
		id: 'cli2',
		type: 'individual',
		name: 'Bob Williams',
		phone: '+1 555 987 6543',
		email: 'bob@mail.com',
		address: '200 Main St, Austin, TX',
	},
]

const mockProjects: Project[] = [
	{
		id: 'proj1',
		projectName: 'E-Commerce Platform',
		description: 'Online store',
		startDate: '2026-01-01',
		endDate: '2026-06-30',
		status: 'active',
		priority: 'high',
		repository: '',
		demoUrl: '',
		owner: 'cli1',
		team: [],
	},
	{
		id: 'proj2',
		projectName: 'Mobile App Redesign',
		description: 'Redesign mobile app',
		startDate: '2026-03-01',
		endDate: '2026-09-30',
		status: 'development',
		priority: 'medium',
		repository: '',
		demoUrl: '',
		owner: 'cli2',
		team: [],
	},
]

const mockTasks: Task[] = [
	{
		id: 't1',
		title: 'Design homepage mockup',
		description: 'Create wireframes',
		priority: 'high',
		status: 'inprogress',
		project: 'E-Commerce Platform',
	},
	{
		id: 't2',
		title: 'Implement authentication',
		description: 'Login/Register flow',
		priority: 'medium',
		status: 'todo',
		project: 'E-Commerce Platform',
	},
	{
		id: 't3',
		title: 'Setup CI/CD pipeline',
		description: 'DevOps configuration',
		priority: 'low',
		status: 'backlog',
		project: 'Mobile App Redesign',
	},
]

const initialTimeEntries: TimeEntry[] = [
	{
		id: 'te1',
		category: 'operacional',
		day: '2026-06-18',
		comment: 'Worked on homepage design',
		hours: 4,
		hourType: 'design',
		clientId: 'cli1',
		projectId: 'proj1',
		taskId: 't1',
	},
	{
		id: 'te2',
		category: 'actividad_empresarial',
		day: '2026-06-17',
		comment: 'Team meeting and planning',
	},
	{
		id: 'te3',
		category: 'vacaciones',
		day: '2026-06-16',
		comment: 'Summer vacation day',
	},
]

export default function TimeEntryRecordPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const [timeEntries] = useState<TimeEntry[]>(initialTimeEntries)
	const [submitted, setSubmitted] = useState(false)

	const entry = id ? timeEntries.find((e) => e.id === id) : undefined

	function handleSubmit(data: TimeEntry) {
		console.log('Time entry data:', data)
		setSubmitted(true)
	}

	if (submitted) {
		return (
			<div className='p-4'>
				<div className='alert alert-success'>
					{id ? 'Time entry updated' : 'Time entry created'} successfully!
				</div>
				<button
					type='button'
					className='btn btn-outline-secondary mt-3'
					onClick={() => navigate('/time-tracking')}
				>
					Back to Time Tracking
				</button>
			</div>
		)
	}

	return (
		<div className='p-4'>
			<TimeEntryForm
				initialData={entry}
				clients={mockClients}
				projects={mockProjects}
				tasks={mockTasks}
				onSubmit={handleSubmit}
				onCancel={() => navigate('/time-tracking')}
			/>
		</div>
	)
}
