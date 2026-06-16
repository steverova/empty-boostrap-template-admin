import type { RouteObject } from 'react-router'
import DatePickerExamplePage from './date-picker'
import DropzoneExamplePage from './drop-zone'
import FullCalendarExamplePage from './full-calendar'
import KanbanExamplePage from './kan-ban/index copy'
import TableExamplePage from './table'
import EditorExamplePage from './editor'

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
        Component: EditorExamplePage
      }
		],
	},
]
