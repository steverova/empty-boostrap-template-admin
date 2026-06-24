import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import {
	mockClients,
	mockCollaborators,
	mockProjects,
	mockTasks,
	mockTimeEntries,
} from '@/mocks'
import type { TimeEntry } from './time-entry.types'
import TimeEntryForm from './time-entry-form'

export function Component() {
	const { id } = useParams()
	const navigate = useNavigate()
	const [timeEntries] = useState<TimeEntry[]>(mockTimeEntries)
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
				collaborators={mockCollaborators}
				onSubmit={handleSubmit}
				onCancel={() => navigate('/time-tracking')}
			/>
		</div>
	)
}
