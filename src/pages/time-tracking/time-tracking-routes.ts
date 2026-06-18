import type { RouteObject } from 'react-router'
import TimeTrackingPage from '.'
import TimeEntryRecordPage from './time-entry-record'

export const timeTrackingRoutes: RouteObject[] = [
	{
		path: 'time-tracking',
		Component: TimeTrackingPage,
		index: true,
	},
	{
		path: 'time-tracking/record',
		Component: TimeEntryRecordPage,
	},
	{
		path: 'time-tracking/record/:id',
		Component: TimeEntryRecordPage,
	},
]
