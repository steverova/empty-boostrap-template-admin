import type { RouteObject } from 'react-router'
import ClientsPage from '.'
import ClientRecordPage from './client-record'

export const clientsRoutes: RouteObject[] = [
	{
		path: 'clients',
		Component: ClientsPage,
		index: true,
	},
	{
		path: 'clients/record',
		Component: ClientRecordPage,
	},
	{
		path: 'clients/record/:id',
		Component: ClientRecordPage,
	},
]
