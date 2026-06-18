import { exampleNavigation } from '@/pages/examples/examples-navigation'
import type { NavItem } from '@/types/navigation-menu'

export const navigationMenu: NavItem[] = [
	...exampleNavigation,
	{
		path: '/projects',
		label: 'Projects',
		type: 'item',
    id: 'projects',
    icon: 'folder-open'
  },
  {
		path: '/clients',
		label: 'Clients',
		type: 'item',
    id: 'clients',
    icon: 'people'
  },
  {
		path: '/tasks',
		label: 'Tasks',
		type: 'item',
    id: 'tasks',
    icon: 'clipboard-check'
	},
]
