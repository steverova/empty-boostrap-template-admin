import Layout from '@components/blocks/layout/layout'
import RootPage from '@components/root'
import LoadingFallback from '@components/shared/loading-fallback'
import { RouteErrorBoundary } from '@components/shared/route-error-boundary'
import type { RouteObject } from 'react-router'
import NotFound from '@/components/blocks/not-found'
import { exampleRoutes } from '@/pages/examples/examples-routes'
import { projectsRoutes } from '@/pages/projects/projects-routes'
import { clientsRoutes } from '@/pages/clients/clients-routes'
import { collaboratorsRoutes } from '@/pages/collaborators/collaborators-routes'
import { tasksRoutes } from '@/pages/tasks/tasks-routes'
import { timeTrackingRoutes } from '@/pages/time-tracking/time-tracking-routes'

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
          ...exampleRoutes,
					...projectsRoutes,
					...clientsRoutes,
					...collaboratorsRoutes,
				...tasksRoutes,
				...timeTrackingRoutes,
			],
			},
			{
				path: 'signin',
				lazy: () => import('../pages/signin'),
			},
		],
	},
	{
		path: '*',
		Component: NotFound,
	},
]
