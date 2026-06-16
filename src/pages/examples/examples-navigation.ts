import type { NavItem } from '@/types/navigation-menu'

export const exampleNavigation: NavItem[] = [
	{
		id: 'table',
		path: '/examples/table',
		label: 'Table',
		icon: 'card-list',
		type: 'item',
	},
	{
		id: 'date-picker',
		path: '/examples/date-picker',
		label: 'Date Picker',
		icon: 'calendar-days',
		type: 'item',
	},
	{
		id: 'dropzone',
		path: '/examples/dropzone',
		label: 'Dropzone',
		icon: 'cloud-upload',
		type: 'item',
	},
	{
		id: 'full-calendar',
		path: '/examples/full-calendar',
		label: 'Full Calendar',
		icon: 'calendar',
		type: 'item',
	},
	{
		id: 'kanban',
		path: '/examples/kanban',
		label: 'Kanban Board',
		icon: 'folder',
		type: 'item',
	},
	{
		id: 'editor',
		path: '/examples/editor',
		label: 'Editor',
		icon: 'pen-square',
		type: 'item',
	},
	{
		id: 'chat',
		path: '/examples/chat',
		label: 'Chat',
		icon: 'message-square',
		type: 'item',
	},
	{
		id: 'notes',
		path: '/examples/google-keep',
		label: 'Notes',
		icon: 'sticky-note',
		type: 'item',
	},
]
