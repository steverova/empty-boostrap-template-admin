import type { RouteObject } from 'react-router'
import CollaboratorsPage from '.'
import CollaboratorRecordPage from './collaborator-record'

export const collaboratorsRoutes: RouteObject[] = [
	{
		path: 'collaborators',
		Component: CollaboratorsPage,
		index: true,
	},
	{
		path: 'collaborators/record',
		Component: CollaboratorRecordPage,
	},
	{
		path: 'collaborators/record/:id',
		Component: CollaboratorRecordPage,
	},
]
