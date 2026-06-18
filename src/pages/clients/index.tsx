import type { ColumnDef } from '@tanstack/react-table'
import { Folder, Pencil } from 'lucide-react'
import { useState } from 'react'
import { Badge } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import AppTable from '@/components/shared/app-table'
import IconButton from '@/components/shared/icon-button'
import type { Client } from './client.types'

const initialClients: Client[] = [
	{
		id: 'c1',
		type: 'company',
		name: 'Alice Chen',
		companyName: 'TechCorp',
		phone: '+1 555 123 4567',
		email: 'alice@techcorp.com',
		address: '100 Tech Ave, San Francisco, CA',
	},
	{
		id: 'c2',
		type: 'individual',
		name: 'Bob Williams',
		phone: '+1 555 987 6543',
		email: 'bob@mail.com',
		address: '200 Main St, Austin, TX',
	},
]

export default function ClientsPage() {
	const [clients] = useState<Client[]>(initialClients)
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
			tableName='Projects'
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
