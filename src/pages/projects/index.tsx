import { useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Pencil } from 'lucide-react'
import { Badge } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import AppTable from '@/components/shared/app-table'
import IconButton from '@/components/shared/icon-button'
import { mockProjects } from '@/mocks'
import type { Project } from './project.types'

const statusLabel: Record<string, string> = {
	development: 'In Development',
	active: 'Active',
	maintenance: 'Maintenance',
	completed: 'Completed',
	inactive: 'Inactive',
}

const statusBg: Record<string, string> = {
	development: 'warning',
	active: 'success',
	maintenance: 'info',
	completed: 'primary',
	inactive: 'secondary',
}

const priorityBg: Record<string, string> = {
	low: 'secondary',
	medium: 'warning',
	high: 'danger',
}

export function Component() {
	const [projects] = useState<Project[]>(mockProjects)
	const navigate = useNavigate()

	const columns: ColumnDef<Project, any>[] = [
		{
			accessorKey: 'projectName',
			header: 'Project',
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
			accessorKey: 'owner',
			header: 'Owner',
		},
		{
			accessorKey: 'startDate',
			header: 'Start Date',
		},
		{
			accessorKey: 'endDate',
			header: 'End Date',
		},
	]

	return (
		<AppTable
			tableName='Projects'
			enableExport
			columns={columns}
			data={projects}
			onAddFn={() => navigate('/projects/record')}
			rowActions={(row) => (
				<IconButton
					aria-label='Edit Project'
					onClick={(e) => {
						e.stopPropagation()
						navigate(`/projects/record/${row.id}`)
					}}
				>
					<Pencil size={16} />
				</IconButton>
			)}
		/>
	)
}
