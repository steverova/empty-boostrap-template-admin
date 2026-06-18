import type { RouteObject } from 'react-router'
import ProjectsPage from '.'

export const projectsRoutes: RouteObject[] = [
	{
		path: 'projects',
		Component: ProjectsPage,
		index: true,
  },
  {
		path: 'projects/:id/record',
		Component: ProjectsPage,
		index: true,
	},
]
