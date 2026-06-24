import type { RouteObject } from 'react-router'

export const tasksRoutes: RouteObject[] = [
	{
		path: 'tasks',
		children: [
			{
				index: true,
				lazy: () => import('.'),
			},
			{
				path: 'record',
				lazy: () => import('./task-record'),
			},
			{
				path: 'record/:id',
				lazy: () => import('./task-record'),
			},
		],
	},
]
