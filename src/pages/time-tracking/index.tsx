import type { ColumnDef } from '@tanstack/react-table'
import { Pencil } from 'lucide-react'
import { useState } from 'react'
import { Badge } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import AppTable from '@/components/shared/app-table'
import IconButton from '@/components/shared/icon-button'
import type { TimeEntry } from './time-entry.types'

const categoryLabel: Record<string, string> = {
	actividad_empresarial: 'Actividad Empresarial',
	enfermedad: 'Enfermedad',
	operacional: 'Operacional',
	vacaciones: 'Vacaciones',
}

const categoryBg: Record<string, string> = {
	actividad_empresarial: 'info',
	enfermedad: 'warning',
	operacional: 'primary',
	vacaciones: 'success',
}

const hourTypeLabel: Record<string, string> = {
	develop: 'Develop',
	qa: 'QA',
	design: 'Design',
	mantenimiento: 'Mantenimiento',
}

const initialTimeEntries: TimeEntry[] = [
	{
		id: 'te1',
		category: 'operacional',
		day: '2026-06-18',
		comment: 'Worked on homepage design',
		hours: 4,
		hourType: 'design',
		clientId: 'cli1',
		projectId: 'proj1',
		taskId: 't1',
	},
	{
		id: 'te2',
		category: 'actividad_empresarial',
		day: '2026-06-17',
		comment: 'Team meeting and planning',
	},
	{
		id: 'te3',
		category: 'vacaciones',
		day: '2026-06-16',
		comment: 'Summer vacation day',
	},
	{
		id: 'te4',
		category: 'enfermedad',
		day: '2026-06-15',
		comment: 'Sick leave',
	},
	{
		id: 'te5',
		category: 'operacional',
		day: '2026-06-14',
		comment: 'Backend API development',
		hours: 6,
		hourType: 'develop',
		clientId: 'cli2',
		projectId: 'proj2',
		taskId: 't2',
	},
]

export default function TimeTrackingPage() {
	const [timeEntries] = useState<TimeEntry[]>(initialTimeEntries)
	const navigate = useNavigate()

	const columns: ColumnDef<TimeEntry, any>[] = [
		{
			accessorKey: 'day',
			header: 'Day',
		},
		{
			accessorKey: 'category',
			header: 'Category',
			cell: ({ row }) => (
				<Badge bg={categoryBg[row.original.category] ?? 'secondary'}>
					{categoryLabel[row.original.category] ?? row.original.category}
				</Badge>
			),
		},
		{
			accessorKey: 'comment',
			header: 'Comment',
			cell: ({ row }) => (
				<span className='text-truncate d-inline-block' style={{ maxWidth: '200px' }}>
					{row.original.comment}
				</span>
			),
		},
		{
			accessorKey: 'hours',
			header: 'Hours',
			cell: ({ row }) => row.original.hours ?? '-',
		},
		{
			accessorKey: 'hourType',
			header: 'Hour Type',
			cell: ({ row }) =>
				row.original.hourType ? hourTypeLabel[row.original.hourType] : '-',
		},
	]

	return (
		<AppTable
			tableName='Time Tracking'
			enableExport
			columns={columns}
			data={timeEntries}
			onAddFn={() => navigate('/time-tracking/record')}
			rowActions={(row) => (
				<IconButton
					aria-label='Edit Time Entry'
					onClick={(e) => {
						e.stopPropagation()
						navigate(`/time-tracking/record/${row.id}`)
					}}
				>
					<Pencil size={16} />
				</IconButton>
			)}
		/>
	)
}
