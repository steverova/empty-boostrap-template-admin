export type TimeEntryCategory = 'actividad_empresarial' | 'enfermedad' | 'operacional' | 'vacaciones'

export type HourType = 'develop' | 'qa' | 'design' | 'mantenimiento'

export interface TimeEntry {
	id: string
	category: TimeEntryCategory
	day: string
	comment: string
	hours?: number
	hourType?: HourType
	collaboratorId?: string
	clientId?: string
	projectId?: string
	taskId?: string
}
