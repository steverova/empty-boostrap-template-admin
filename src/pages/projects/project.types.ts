export type ProjectType = 'individual' | 'company'

export type ProjectStatus = 'active' | 'inactive' | 'development' | 'maintenance' | 'completed'

export type ProjectPriority = 'low' | 'medium' | 'high'

export interface Project {
	id: string
	type: ProjectType
	companyName?: string
	contactName: string
	phone: string
	email: string
	address: string
	projectName: string
	description: string
	startDate: string
	endDate: string
	status: ProjectStatus
	priority: ProjectPriority
	documentation: string
	repository: string
	demoUrl: string
	owner: string
	team: string[]
}
