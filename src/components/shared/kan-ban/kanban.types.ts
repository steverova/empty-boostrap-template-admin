import type { LucideIcon } from "lucide-react"

export type TaskStatus = 'backlog' | 'todo' | 'inprogress' | 'test' | 'done' | 'cancelled'

export interface Task {
	id: string
	title: string
	description: string
	priority: 'low' | 'medium' | 'high'
	status?: TaskStatus
	assignee?: string
	dueDate?: string
	columnId: string
	project?: string
	members?: string[]
	reply?: string
}

export interface Column {
	id: string
	title: string
	icon: LucideIcon
	color: string
}