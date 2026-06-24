import type { RouteObject } from 'react-router'

export const clientsRoutes: RouteObject[] = [
	{
		path: 'clients',
		children: [
			{
				index: true,
				lazy: () => import('.'),
			},
			{
				path: 'record',
				lazy: () => import('./client-record'),
			},
			{
				path: 'record/:id',
				lazy: () => import('./client-record'),
			},
		],
	},
]
