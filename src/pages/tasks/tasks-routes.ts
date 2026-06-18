import type { RouteObject } from 'react-router'
import TasksPage from '.'
import TaskRecordPage from './task-record'

export const tasksRoutes: RouteObject[] = [
	{
		path: 'tasks',
		Component: TasksPage,
		index: true,
	},
	{
		path: 'tasks/record',
		Component: TaskRecordPage,
	},
	{
		path: 'tasks/record/:id',
		Component: TaskRecordPage,
	},
]
