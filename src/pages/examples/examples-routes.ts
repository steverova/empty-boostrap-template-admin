import type { RouteObject } from 'react-router'

export const exampleRoutes: RouteObject[] = [
	{
		path: 'examples',
		children: [
			{
				index: true,
				path: 'table',
				lazy: () => import('./table'),
			},
			{
				path: 'date-picker',
				lazy: () => import('./date-picker'),
			},
			{
				path: 'dropzone',
				lazy: () => import('./drop-zone'),
			},
			{
				path: 'full-calendar',
				lazy: () => import('./full-calendar'),
			},
			{
				path: 'kanban',
				lazy: () => import('./kan-ban'),
			},
			{
				path: 'editor',
				lazy: () => import('./editor'),
			},
			{
				path: 'chat',
				lazy: () => import('./chat'),
			},
			{
				path: 'chat/:contactId',
				lazy: () => import('./chat'),
			},
			{
				path: 'google-keep',
				lazy: () => import('./google-keep'),
			},
		],
	},
]
