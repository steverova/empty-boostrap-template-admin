import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { mockCollaborators, mockProjects, mockTasks } from '@/mocks'
import type { Task } from './task.types'
import TaskForm from './task-form'

export function Component() {
	const { id } = useParams()
	const navigate = useNavigate()
	const [submitted, setSubmitted] = useState(false)

	const initialData = id ? mockTasks.find((t) => t.id === id) : undefined

	function handleSubmit(data: Task) {
		console.log('Task data:', data)
		setSubmitted(true)
	}

	if (submitted) {
		return (
			<div className=''>
				<div className='alert alert-success'>
					{id ? 'Task updated' : 'Task created'} successfully!
				</div>
				<button
					type='button'
					className='btn btn-outline-secondary mt-3'
					onClick={() => navigate('/tasks')}
				>
					Back to Tasks
				</button>
			</div>
		)
	}

	return (
		<div className=''>
			<TaskForm
				initialData={initialData as Task | undefined}
				collaborators={mockCollaborators.map((c) => ({
					id: c.id,
					name: `${c.firstName} ${c.lastName}`,
				}))}
				projects={mockProjects}
				onSubmit={handleSubmit}
				onCancel={() => navigate('/tasks')}
			/>
		</div>
	)
}
