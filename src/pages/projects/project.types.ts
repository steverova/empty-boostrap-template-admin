export type ProjectStatus = 'active' | 'inactive' | 'development' | 'maintenance' | 'completed'

export type ProjectPriority = 'low' | 'medium' | 'high'

export interface Project {
	id: string
	projectName: string
	description: string
	startDate: string
	endDate: string
	status: ProjectStatus
	priority: ProjectPriority
	repository: string
	demoUrl: string
	owner: string
	team: string[]
}
