import type { LucideIcon } from "lucide-react"

export interface Task {
	id: string
	title: string
	description: string
	priority: 'low' | 'medium' | 'high'
	assignee?: string
	dueDate?: string
	columnId: string
}

export interface Column {
	id: string
	title: string
	icon: LucideIcon
	color: string
}