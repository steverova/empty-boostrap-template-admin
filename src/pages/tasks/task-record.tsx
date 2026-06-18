import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import TaskForm from './task-form'
import { initialTasks } from '@/components/shared/kan-ban/kanban-mock'
import type { Task } from './task.types'

const mockCollaborators = [
	{ id: 'col1', name: 'John Doe' },
	{ id: 'col2', name: 'Jane Smith' },
	{ id: 'col3', name: 'Mike Johnson' },
	{ id: 'col4', name: 'Sarah Williams' },
	{ id: 'col5', name: 'Tom Brown' },
]

const mockProjects = [
	{ id: 'proj1', projectName: 'E-Commerce Platform' },
	{ id: 'proj2', projectName: 'Mobile App Redesign' },
]

export default function TaskRecordPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const [submitted, setSubmitted] = useState(false)

	const initialData = id ? initialTasks.find((t) => t.id === id) : undefined

	function handleSubmit(data: Task) {
		console.log('Task data:', data)
		setSubmitted(true)
	}

	if (submitted) {
		return (
			<div className='p-4'>
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
		<div className='p-4'>
			<TaskForm
				initialData={initialData as Task | undefined}
				collaborators={mockCollaborators}
				projects={mockProjects}
				onSubmit={handleSubmit}
				onCancel={() => navigate('/tasks')}
			/>
		</div>
	)
}
