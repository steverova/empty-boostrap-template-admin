import type { RouteObject } from 'react-router'

export const collaboratorsRoutes: RouteObject[] = [
	{
		path: 'collaborators',
		children: [
			{
				index: true,
				lazy: () => import('.'),
			},
			{
				path: 'record',
				lazy: () => import('./collaborator-record'),
			},
			{
				path: 'record/:id',
				lazy: () => import('./collaborator-record'),
			},
		],
	},
]
