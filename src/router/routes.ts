import Layout from '@components/blocks/layout/layout'
import RootPage from '@components/root'
import LoadingFallback from '@components/shared/loading-fallback'
import { RouteErrorBoundary } from '@components/shared/route-error-boundary'
import type { RouteObject } from 'react-router'
import NotFound from '@/components/blocks/not-found'
import { clientsRoutes } from '@/pages/clients/clients-routes'
import { collaboratorsRoutes } from '@/pages/collaborators/collaborators-routes'
import { exampleRoutes } from '@/pages/examples/examples-routes'
import { projectsRoutes } from '@/pages/projects/projects-routes'
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
					...clientsRoutes,
					...collaboratorsRoutes,
					...projectsRoutes,
					...tasksRoutes,
					...timeTrackingRoutes,
				],
      },
      {
				path: 'server-error',
				lazy: () => import('../pages/feedback/server-error'),
			},
      {
				path: 'invalid-token',
				lazy: () => import('../pages/feedback/invalid-token'),
			},
      {
				path: 'signin-success',
				lazy: () => import('../pages/feedback/success-verification'),
			},
      {
				path: 'forgot-password',
				lazy: () => import('../pages/signin'),
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
