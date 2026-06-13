import {
	AlertCircle,
	ArrowRight,
	CheckCircle,
	Clock,
	XCircle,
} from 'lucide-react'
import type { Column } from './kanban.types'

export const columns: Column[] = [
	{ id: 'backlog', title: 'Backlog', icon: AlertCircle, color: '#6c757d' },
	{ id: 'todo', title: 'Todo', icon: Clock, color: '#007bff' },
	{
		id: 'inprogress',
		title: 'In Progress',
		icon: ArrowRight,
		color: '#17a2b8',
	},
	{ id: 'test', title: 'Testing', icon: AlertCircle, color: '#ffc107' },
	{ id: 'done', title: 'Done', icon: CheckCircle, color: '#28a745' },
	{ id: 'cancelled', title: 'Cancelled', icon: XCircle, color: '#dc3545' },
]

export function getPriorityVariant(priority: string) {
	switch (priority) {
		case 'high':
			return 'danger'
		case 'medium':
			return 'warning'
		case 'low':
			return 'success'
		default:
			return 'secondary'
	}
}
