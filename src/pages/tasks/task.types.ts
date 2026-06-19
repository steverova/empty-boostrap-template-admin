export type TaskPriority = 'low' | 'medium' | 'high'

export type TaskStatus = 'backlog' | 'todo' | 'inprogress' | 'test' | 'done' | 'cancelled'

export type AttachmentType = 'image' | 'video' | 'link'

export interface Attachment {
	id: string
	type: AttachmentType
	url: string
	name: string
}

export interface TodoItem {
	id: string
	text: string
	description?: string
	completed: boolean
	attachments?: Attachment[]
}

export interface Task {
	id: string
	title: string
	description: string
	priority: TaskPriority
	status: TaskStatus
	assignee?: string
	dueDate?: string
	project?: string
	members?: string[]
	todos?: TodoItem[]
	reply?: string
}
