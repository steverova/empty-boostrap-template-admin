import type { NavItem } from '@/types/navigation-menu'

export const exampleNavigation: NavItem[] = [
	{
		type: 'group',
		id: 'examples',
		label: 'Examples',
		icon: 'box',
		auth: ['Administrador', 'Viewer'],
		children: [
			{
				id: 'table',
				path: '/examples/table',
				label: 'Table',
				type: 'item',
			},
			{
				id: 'date-picker',
				path: '/examples/date-picker',
				label: 'Date Picker',
				type: 'item',
			},
			{
				id: 'dropzone',
				path: '/examples/dropzone',
				label: 'Dropzone',
				type: 'item',
			},
			{
				id: 'kanban',
				path: '/examples/kanban',
				label: 'Kanban Board',
				type: 'item',
			},
			{
				id: 'editor',
				path: '/examples/editor',
				label: 'Editor',
				type: 'item',
			},
		],
	},
]
