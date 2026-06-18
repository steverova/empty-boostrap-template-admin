import { useState } from 'react'
import type { ProjectFormData } from './project.schema'
import ProjectForm from './project-form'

export default function ProjectsPage() {
	const [submitted, setSubmitted] = useState<ProjectFormData | null>(null)

	function handleSubmit(data: ProjectFormData) {
		console.log('Project data:', data)
		setSubmitted(data)
	}

	if (submitted) {
		return (
			<div className='p-4'>
				<div className='alert alert-success'>Project created successfully!</div>
				<pre className='bg-body p-3 rounded border mt-3'>
					{JSON.stringify(submitted, null, 2)}
				</pre>
				<button
					type='button'
					className='btn btn-outline-secondary mt-3'
					onClick={() => setSubmitted(null)}
				>
					Create Another
				</button>
			</div>
		)
	}

	return <ProjectForm onSubmit={handleSubmit} />
}
