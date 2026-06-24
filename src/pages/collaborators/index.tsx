import type { ColumnDef } from '@tanstack/react-table'
import { Pencil } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import AppTable from '@/components/shared/app-table'
import IconButton from '@/components/shared/icon-button'
import { mockCollaborators } from '@/mocks'
import type { Collaborator } from './collaborator.types'

export default function CollaboratorsPage() {
	const [collaborators] = useState<Collaborator[]>(mockCollaborators)
	const navigate = useNavigate()

	const columns: ColumnDef<Collaborator, any>[] = [
		{
			accessorFn: (row) => `${row.firstName} ${row.lastName}`,
			id: 'name',
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
			tableName='Collaborators'
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
