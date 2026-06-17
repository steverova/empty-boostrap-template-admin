import type { RouteObject } from 'react-router'
import ChatExamplePage from './chat'
import DatePickerExamplePage from './date-picker'
import DropzoneExamplePage from './drop-zone'
import EditorExamplePage from './editor'
import FullCalendarExamplePage from './full-calendar'
import GoogleKeepExamplePage from './google-keep'
import KanbanExamplePage from './kan-ban/index copy'
import TableExamplePage from './table'

export const exampleRoutes: RouteObject[] = [
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
				path: 'full-calendar',
				Component: FullCalendarExamplePage,
			},
			{
				path: 'kanban',
				Component: KanbanExamplePage,
			},
			{
				path: 'editor',
				Component: EditorExamplePage,
			},
			{
				path: 'chat',
				Component: ChatExamplePage,
			},
			{
				path: 'google-keep',
				Component: GoogleKeepExamplePage,
			},
		],
	},
]
