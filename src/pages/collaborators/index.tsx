import type { ColumnDef } from '@tanstack/react-table'
import { Pencil } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import AppTable from '@/components/shared/app-table'
import IconButton from '@/components/shared/icon-button'
import type { Collaborator } from './collaborator.types'

const initialCollaborators: Collaborator[] = [
	{
		id: 'col1',
		name: 'John Doe',
		email: 'john@example.com',
		role: 'developer',
		phone: '+1 555 111 2222',
	},
	{
		id: 'col2',
		name: 'Jane Smith',
		email: 'jane@example.com',
		role: 'design',
	},
]

export default function CollaboratorsPage() {
	const [collaborators] = useState<Collaborator[]>(initialCollaborators)
	const navigate = useNavigate()

	const columns: ColumnDef<Collaborator, any>[] = [
		{
			accessorKey: 'name',
			header: 'Name',
		},
		{
			accessorKey: 'role',
			header: 'Role',
			cell: ({ row }) =>
				row.original.role.charAt(0).toUpperCase() + row.original.role.slice(1),
		},
		{
			accessorKey: 'email',
			header: 'Email',
		},
		{
			accessorKey: 'phone',
			header: 'Phone',
			cell: ({ row }) => row.original.phone ?? '-',
		},
	]

	return (
		<AppTable
			columns={columns}
			data={collaborators}
			onAddFn={() => navigate('/collaborators/record')}
			rowActions={(row) => (
				<IconButton
					aria-label='Edit Collaborator'
					onClick={(e) => {
						e.stopPropagation()
						navigate(`/collaborators/record/${row.id}`)
					}}
				>
					<Pencil size={16} />
				</IconButton>
			)}
		/>
	)
}
