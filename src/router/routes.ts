import Layout from '@components/blocks/layout/layout'
import RootPage from '@components/root'
import LoadingFallback from '@components/shared/loading-fallback'
import { RouteErrorBoundary } from '@components/shared/route-error-boundary'
import type { RouteObject } from 'react-router'
import { exampleRoutes } from '@/pages/examples/examples-routes'

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
				],
			},
			{
				path: 'signin',
				lazy: () => import('../pages/signin'),
			},
		],
	},
]
