import Layout from '@components/blocks/layout/layout'
import RootPage from '@components/root'
import LoadingFallback from '@components/shared/loading-fallback'
import { RouteErrorBoundary } from '@components/shared/route-error-boundary'
import type { RouteObject } from 'react-router'
import TableExamplePage from '@/pages/examples/table'
import DropzoneExamplePage from '@/pages/examples/drop-zone'
import KanbanExamplePage from '@/pages/examples/kan-ban'
import DatePickerExamplePage from '@/pages/examples/date-picker'

export const routes: RouteObject[] = [
	{
		path: '/',
		Component: RootPage,
		ErrorBoundary: RouteErrorBoundary,
		HydrateFallback: LoadingFallback,
		children: [
			{
				path: '/',
				Component: Layout,
				children: [
					{
						index: true,
						lazy: () => import('../pages/home'),
					},
					{
						path: 'examples',
						children: [
							{
								index: true,
								path: 'table',
								Component: TableExamplePage,
							},
							{
							
								path: 'date-picker',
								Component: DatePickerExamplePage,
							},
							{
								
								path: 'dropzone',
								Component: DropzoneExamplePage,
							},
							{
							
								path: 'kanban',
								Component: KanbanExamplePage,
							},
						],
					},
				],
			},
			{
				path: 'signin',
				lazy: () => import('../pages/signin'),
			},
		],
	},
]
