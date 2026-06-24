import type { RouteObject } from 'react-router'

export const projectsRoutes: RouteObject[] = [
	{
		path: 'projects',
		children: [
			{
				index: true,
				lazy: () => import('.'),
			},
			{
				path: 'record',
				lazy: () => import('./project-record'),
			},
			{
				path: 'record/:id',
				lazy: () => import('./project-record'),
			},
		],
	},
]
