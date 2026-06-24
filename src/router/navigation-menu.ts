import { ClipboardCheck, Clock, FolderOpen, Gauge, Users } from 'lucide-react'
import { exampleNavigation } from '@/pages/examples/examples-navigation'
import type { NavItem } from '@/types/navigation-menu'

export const navigationMenu: NavItem[] = [
	{
		path: '/',
		label: 'Dashboard',
		type: 'item',
		id: 'dashboard',
		icon: Gauge,
  },
  {
		path: '/clients',
		label: 'Clients',
		type: 'item',
		id: 'clients',
		icon: Users,
  },
  {
		path: '/collaborators',
		label: 'Collaborators',
		type: 'item',
		id: 'collaborators',
		icon: Users,
	},
	{
		path: '/projects',
		label: 'Projects',
		type: 'item',
		id: 'projects',
		icon: FolderOpen,
	},


	{
		path: '/tasks',
		label: 'Tasks',
		type: 'item',
		id: 'tasks',
		icon: ClipboardCheck,
	},
	{
		path: '/time-tracking',
		label: 'Time Tracking',
		type: 'item',
		id: 'time-tracking',
		icon: Clock,
	},
	...exampleNavigation,
]
