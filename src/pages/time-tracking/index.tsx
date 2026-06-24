import type { ColumnDef } from '@tanstack/react-table'
import { Pencil } from 'lucide-react'
import { useState } from 'react'
import { Badge, Tab, Tabs } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import AppTable from '@/components/shared/app-table'
import IconButton from '@/components/shared/icon-button'
import { mockTimeEntries } from '@/mocks'
import HoursByTicket from './hours-by-ticket'
import HoursByUser from './hours-by-user'
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

export function Component() {
	const [timeEntries] = useState<TimeEntry[]>(mockTimeEntries)
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
				<span
					className='text-truncate d-inline-block'
					style={{ maxWidth: '200px' }}
				>
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
		<div className='h-100 d-flex flex-column'>
			<Tabs defaultActiveKey='entries' className='p-0 border-bottom' fill>
				<Tab eventKey='entries' title='Time Entries'>
					<div className='flex-grow-1 overflow-auto p-0'>
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
					</div>
				</Tab>
				<Tab eventKey='hours-by-user' title='Horas por Usuario'>
					<div className=' overflow-auto flex-grow-1'>
						<HoursByUser timeEntries={timeEntries} />
					</div>
				</Tab>
				<Tab eventKey='hours-by-ticket' title='Horas por Ticket'>
					<div className=' overflow-auto flex-grow-1'>
						<HoursByTicket timeEntries={timeEntries} />
					</div>
				</Tab>
			</Tabs>
		</div>
	)
}
