import type { ColumnDef } from '@tanstack/react-table'
import { Eye, LayoutGrid, List, MessageSquare, Pencil } from 'lucide-react'
import { useState } from 'react'
import { Badge, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import AppTable from '@/components/shared/app-table'
import IconButton from '@/components/shared/icon-button'
import KanbanBoard from '@/components/shared/kan-ban'
import { mockTasks } from '@/mocks'
import TaskDetailsModal from './task-details-modal'
import TaskReplyModal from './task-reply-modal'
import type { Task, TaskStatus } from './task.types'

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

export function Component() {
	const [view, setView] = useState<'table' | 'kanban'>('table')
	const [tasks, setTasks] = useState<Task[]>(mockTasks)
	const [selectedTask, setSelectedTask] = useState<Task | null>(null)
	const [showDetails, setShowDetails] = useState(false)
	const [showReply, setShowReply] = useState(false)
	const navigate = useNavigate()

	function handleReply(taskId: string, reply: string, status: TaskStatus) {
		setTasks((prev) =>
			prev.map((t) => (t.id === taskId ? { ...t, reply, status } : t)),
		)
	}

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
		{
			id: 'actions',
			header: 'Actions',
			cell: ({ row }) => (
				<div className='d-flex gap-1'>
					<IconButton
						aria-label='Edit Task'
						onClick={(e) => {
							e.stopPropagation()
							navigate(`/tasks/record/${row.original.id}`)
						}}
					>
						<Pencil size={16} />
					</IconButton>
					<IconButton
						aria-label='View details'
						onClick={(e) => {
							e.stopPropagation()
							setSelectedTask(row.original)
							setShowDetails(true)
						}}
					>
						<Eye size={16} />
					</IconButton>
					<IconButton
						aria-label='Reply to task'
						onClick={(e) => {
							e.stopPropagation()
							setSelectedTask(row.original)
							setShowReply(true)
						}}
					>
						<MessageSquare size={16} />
					</IconButton>
				</div>
			),
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
							data={tasks}
							onAddFn={() => navigate('/tasks/record')}
						/>
					</div>
				) : (
					<KanbanBoard />
				)}

				<TaskDetailsModal
					task={selectedTask}
					show={showDetails}
					onHide={() => setShowDetails(false)}
				/>

				<TaskReplyModal
					task={selectedTask}
					show={showReply}
					onHide={() => setShowReply(false)}
					onSubmit={handleReply}
				/>
			</div>
		</div>
	)
}
