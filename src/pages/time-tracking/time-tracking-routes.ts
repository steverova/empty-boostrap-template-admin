import type { RouteObject } from 'react-router'

export const timeTrackingRoutes: RouteObject[] = [
	{
		path: 'time-tracking',
		children: [
			{
				index: true,
				lazy: () => import('.'),
			},
			{
				path: 'record',
				lazy: () => import('./time-entry-record'),
			},
			{
				path: 'record/:id',
				lazy: () => import('./time-entry-record'),
			},
		],
	},
]
