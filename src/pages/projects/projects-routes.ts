import type { RouteObject } from 'react-router'
import ProjectsPage from '.'
import ProjectRecordPage from './project-record'

export const projectsRoutes: RouteObject[] = [
	{
		path: 'projects',
		Component: ProjectsPage,
		index: true,
	},
	{
		path: 'projects/record',
		Component: ProjectRecordPage,
	},
	{
		path: 'projects/record/:id',
		Component: ProjectRecordPage,
	},
]
