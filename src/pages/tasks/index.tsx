import type { ColumnDef } from '@tanstack/react-table'
import { LayoutGrid, List, Pencil } from 'lucide-react'
import { useState } from 'react'
import { Badge, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import AppTable from '@/components/shared/app-table'
import IconButton from '@/components/shared/icon-button'
import KanbanBoard from '@/components/shared/kan-ban'
import { initialTasks } from '@/components/shared/kan-ban/kanban-mock'
import type { Task } from './task.types'

const priorityBg: Record<string, string> = {
	low: 'success',
	medium: 'warning',
	high: 'danger',
}

const statusLabel: Record<string, string> = {
	backlog: 'Backlog',
	todo: 'Todo',
	inprogress: 'In Progress',
	test: 'Testing',
	done: 'Done',
	cancelled: 'Cancelled',
}

const statusBg: Record<string, string> = {
	backlog: 'secondary',
	todo: 'info',
	inprogress: 'primary',
	test: 'warning',
	done: 'success',
	cancelled: 'danger',
}

export default function TasksPage() {
	const [view, setView] = useState<'table' | 'kanban'>('table')
	const navigate = useNavigate()

	const columns: ColumnDef<Task, any>[] = [
		{
			accessorKey: 'title',
			header: 'Title',
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ row }) => (
				<Badge bg={statusBg[row.original.status] ?? 'secondary'}>
					{statusLabel[row.original.status] ?? row.original.status}
				</Badge>
			),
		},
		{
			accessorKey: 'priority',
			header: 'Priority',
			cell: ({ row }) => (
				<Badge bg={priorityBg[row.original.priority] ?? 'secondary'}>
					{row.original.priority}
				</Badge>
			),
		},
		{
			accessorKey: 'assignee',
			header: 'Assignee',
			cell: ({ row }) => row.original.assignee ?? '-',
		},
		{
			accessorKey: 'project',
			header: 'Project',
			cell: ({ row }) => row.original.project ?? '-',
		},
		{
			accessorKey: 'dueDate',
			header: 'Due Date',
			cell: ({ row }) => row.original.dueDate ?? '-',
		},
	]

	return (
		<div className='h-100 d-flex flex-column'>
			<div className='d-flex justify-content-between align-items-center p-2 border-bottom'>
				<div className='d-flex gap-2'>
					<Button
						variant={view === 'table' ? 'primary' : 'outline-primary'}
						size='sm'
						onClick={() => setView('table')}
					>
						<List size={16} className='me-1' />
						Table
					</Button>
					<Button
						variant={view === 'kanban' ? 'primary' : 'outline-primary'}
						size='sm'
						onClick={() => setView('kanban')}
					>
						<LayoutGrid size={16} className='me-1' />
						Kanban
					</Button>
				</div>
			</div>

			<div className='flex-grow-1 overflow-auto'>
				{view === 'table' ? (
					<div className='h-100'>
						<AppTable
							tableName='Tasks'
							enableExport
							columns={columns}
							data={initialTasks}
							onAddFn={() => navigate('/tasks/record')}
							rowActions={(row) => (
								<IconButton
									aria-label='Edit Task'
									onClick={(e) => {
										e.stopPropagation()
										navigate(`/tasks/record/${row.id}`)
									}}
								>
									<Pencil size={16} />
								</IconButton>
							)}
						/>
					</div>
				) : (
					<KanbanBoard />
				)}
			</div>
		</div>
	)
}
