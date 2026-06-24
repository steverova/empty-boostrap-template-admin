import type { ColumnDef } from '@tanstack/react-table'
import { Folder, Pencil } from 'lucide-react'
import { useState } from 'react'
import { Badge } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import AppTable from '@/components/shared/app-table'
import IconButton from '@/components/shared/icon-button'
import { mockClients } from '@/mocks'
import type { Client } from './client.types'

export function Component() {
	const [clients] = useState<Client[]>(mockClients)
	const navigate = useNavigate()

	const columns: ColumnDef<Client, any>[] = [
		{
			accessorKey: 'name',
			header: 'Name',
		},
		{
			accessorKey: 'type',
			header: 'Type',
			cell: ({ row }) => (
				<Badge bg={row.original.type === 'company' ? 'info' : 'secondary'}>
					{row.original.type}
				</Badge>
			),
		},
		{
			accessorKey: 'companyName',
			header: 'Company',
			cell: ({ row }) => row.original.companyName ?? '-',
		},
		{
			accessorKey: 'email',
			header: 'Email',
		},
		{
			accessorKey: 'phone',
			header: 'Phone',
		},
	]

	return (
		<AppTable
			tableName='Clients'
			enableExport
			columns={columns}
			data={clients}
			onAddFn={() => navigate('/clients/record')}
			rowActions={(row) => (
				<div className='d-flex'>
					<IconButton
						aria-label='Add Project'
						onClick={(e) => {
							e.stopPropagation()
							navigate(`/projects?clientId=${row.id}`)
						}}
					>
						<Folder size={16} />
					</IconButton>
					<IconButton
						aria-label='Edit Client'
						onClick={(e) => {
							e.stopPropagation()
							navigate(`/clients/record/${row.id}`)
						}}
					>
						<Pencil size={16} />
					</IconButton>
				</div>
			)}
		/>
	)
}
