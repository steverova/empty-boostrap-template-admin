import { Badge } from 'react-bootstrap'
import './App.css'
import type { ColumnDef } from '@tanstack/react-table'
import AppTable from './components/shared/app-table'
import { RowActions } from './components/shared/app-table/row-actions'
import ModalDialog from './components/shared/modal-dialog'
import { useModal } from './hooks/use-modal'

interface User {
	id: number
	name: string
	email: string
	role: string
	country: string
	createdAt: string
	status: 'active' | 'inactive'
	department: string
}

const USERS: User[] = [
	{
		id: 1,
		name: 'Juan',
		email: 'juan@mail.com',
		role: 'Admin',
		country: 'Argentina',
		createdAt: '2024-01-15',
		status: 'active',
		department: 'IT',
	},
	{
		id: 2,
		name: 'Ana',
		email: 'ana@mail.com',
		role: 'User',
		country: 'México',
		createdAt: '2024-02-20',
		status: 'active',
		department: 'Marketing',
	},
	{
		id: 3,
		name: 'Carlos',
		email: 'carlos@mail.com',
		role: 'User',
		country: 'Colombia',
		createdAt: '2024-03-10',
		status: 'inactive',
		department: 'Ventas',
	},
	{
		id: 4,
		name: 'María',
		email: 'maria@mail.com',
		role: 'Editor',
		country: 'Chile',
		createdAt: '2024-01-25',
		status: 'active',
		department: 'Contenido',
	},
	{
		id: 5,
		name: 'Pedro',
		email: 'pedro@mail.com',
		role: 'Admin',
		country: 'Argentina',
		createdAt: '2024-04-05',
		status: 'active',
		department: 'IT',
	},
	{
		id: 6,
		name: 'Laura',
		email: 'laura@mail.com',
		role: 'User',
		country: 'Perú',
		createdAt: '2024-02-14',
		status: 'active',
		department: 'RRHH',
	},
	{
		id: 7,
		name: 'Diego',
		email: 'diego@mail.com',
		role: 'Moderator',
		country: 'Uruguay',
		createdAt: '2024-03-22',
		status: 'active',
		department: 'Soporte',
	},
	{
		id: 8,
		name: 'Sofía',
		email: 'sofia@mail.com',
		role: 'Viewer',
		country: 'México',
		createdAt: '2024-05-01',
		status: 'inactive',
		department: 'Legal',
	},
	{
		id: 9,
		name: 'Luis',
		email: 'luis@mail.com',
		role: 'Editor',
		country: 'Colombia',
		createdAt: '2024-01-30',
		status: 'active',
		department: 'Contenido',
	},
	{
		id: 10,
		name: 'Elena',
		email: 'elena@mail.com',
		role: 'User',
		country: 'Chile',
		createdAt: '2024-04-18',
		status: 'active',
		department: 'Ventas',
	},
	{
		id: 11,
		name: 'Pablo',
		email: 'pablo@mail.com',
		role: 'Admin',
		country: 'Argentina',
		createdAt: '2024-02-28',
		status: 'active',
		department: 'IT',
	},
	{
		id: 12,
		name: 'Clara',
		email: 'clara@mail.com',
		role: 'User',
		country: 'Perú',
		createdAt: '2024-03-15',
		status: 'inactive',
		department: 'Marketing',
	},
	{
		id: 13,
		name: 'Andrés',
		email: 'andres@mail.com',
		role: 'Viewer',
		country: 'Uruguay',
		createdAt: '2024-05-10',
		status: 'active',
		department: 'Legal',
	},
	{
		id: 14,
		name: 'Valentina',
		email: 'valentina@mail.com',
		role: 'Editor',
		country: 'Colombia',
		createdAt: '2024-01-20',
		status: 'active',
		department: 'Contenido',
	},
	{
		id: 15,
		name: 'Javier',
		email: 'javier@mail.com',
		role: 'Moderator',
		country: 'México',
		createdAt: '2024-04-25',
		status: 'active',
		department: 'Soporte',
	},
	{
		id: 16,
		name: 'Isabel',
		email: 'isabel@mail.com',
		role: 'User',
		country: 'Chile',
		createdAt: '2024-02-08',
		status: 'inactive',
		department: 'RRHH',
	},
	{
		id: 17,
		name: 'Ricardo',
		email: 'ricardo@mail.com',
		role: 'Admin',
		country: 'Argentina',
		createdAt: '2024-03-30',
		status: 'active',
		department: 'IT',
	},
	{
		id: 18,
		name: 'Camila',
		email: 'camila@mail.com',
		role: 'Viewer',
		country: 'Perú',
		createdAt: '2024-05-15',
		status: 'active',
		department: 'Ventas',
	},
	{
		id: 19,
		name: 'Fernando',
		email: 'fernando@mail.com',
		role: 'Editor',
		country: 'Colombia',
		createdAt: '2024-01-12',
		status: 'active',
		department: 'Contenido',
	},
	{
		id: 20,
		name: 'Gabriela',
		email: 'gabriela@mail.com',
		role: 'User',
		country: 'Uruguay',
		createdAt: '2024-04-02',
		status: 'inactive',
		department: 'Marketing',
	},
	{
		id: 21,
		name: 'Tomás',
		email: 'tomas@mail.com',
		role: 'Moderator',
		country: 'México',
		createdAt: '2024-02-18',
		status: 'active',
		department: 'Soporte',
	},
	{
		id: 22,
		name: 'Florencia',
		email: 'florencia@mail.com',
		role: 'User',
		country: 'Chile',
		createdAt: '2024-03-05',
		status: 'active',
		department: 'Legal',
	},
	{
		id: 23,
		name: 'Martín',
		email: 'martin@mail.com',
		role: 'Admin',
		country: 'Argentina',
		createdAt: '2024-05-20',
		status: 'active',
		department: 'IT',
	},
	{
		id: 24,
		name: 'Victoria',
		email: 'victoria@mail.com',
		role: 'Viewer',
		country: 'Perú',
		createdAt: '2024-01-08',
		status: 'inactive',
		department: 'RRHH',
	},
	{
		id: 25,
		name: 'Nicolás',
		email: 'nicolas@mail.com',
		role: 'Editor',
		country: 'Colombia',
		createdAt: '2024-04-12',
		status: 'active',
		department: 'Contenido',
	},
	{
		id: 26,
		name: 'Paula',
		email: 'paula@mail.com',
		role: 'User',
		country: 'Uruguay',
		createdAt: '2024-02-25',
		status: 'active',
		department: 'Ventas',
	},
	{
		id: 27,
		name: 'Hugo',
		email: 'hugo@mail.com',
		role: 'Moderator',
		country: 'México',
		createdAt: '2024-03-18',
		status: 'active',
		department: 'Soporte',
	},
	{
		id: 28,
		name: 'Daniela',
		email: 'daniela@mail.com',
		role: 'Admin',
		country: 'Chile',
		createdAt: '2024-05-05',
		status: 'active',
		department: 'IT',
	},
	{
		id: 29,
		name: 'Emilio',
		email: 'emilio@mail.com',
		role: 'User',
		country: 'Argentina',
		createdAt: '2024-01-22',
		status: 'inactive',
		department: 'Marketing',
	},
	{
		id: 30,
		name: 'Cecilia',
		email: 'cecilia@mail.com',
		role: 'Viewer',
		country: 'Perú',
		createdAt: '2024-04-08',
		status: 'active',
		department: 'Legal',
	},
	{
		id: 31,
		name: 'Alejandro',
		email: 'alejandro@mail.com',
		role: 'Editor',
		country: 'Colombia',
		createdAt: '2024-02-12',
		status: 'active',
		department: 'Contenido',
	},
	{
		id: 32,
		name: 'Natalia',
		email: 'natalia@mail.com',
		role: 'User',
		country: 'Uruguay',
		createdAt: '2024-03-25',
		status: 'inactive',
		department: 'RRHH',
	},
	{
		id: 33,
		name: 'Gonzalo',
		email: 'gonzalo@mail.com',
		role: 'Moderator',
		country: 'México',
		createdAt: '2024-05-18',
		status: 'active',
		department: 'Soporte',
	},
	{
		id: 34,
		name: 'Renata',
		email: 'renata@mail.com',
		role: 'Admin',
		country: 'Chile',
		createdAt: '2024-01-05',
		status: 'active',
		department: 'IT',
	},
	{
		id: 35,
		name: 'Mauricio',
		email: 'mauricio@mail.com',
		role: 'User',
		country: 'Argentina',
		createdAt: '2024-04-22',
		status: 'active',
		department: 'Ventas',
	},
	{
		id: 36,
		name: 'Luciana',
		email: 'luciana@mail.com',
		role: 'Editor',
		country: 'Perú',
		createdAt: '2024-02-05',
		status: 'inactive',
		department: 'Contenido',
	},
	{
		id: 37,
		name: 'Esteban',
		email: 'esteban@mail.com',
		role: 'Viewer',
		country: 'Colombia',
		createdAt: '2024-03-12',
		status: 'active',
		department: 'Legal',
	},
	{
		id: 38,
		name: 'Silvina',
		email: 'silvina@mail.com',
		role: 'User',
		country: 'Uruguay',
		createdAt: '2024-05-25',
		status: 'active',
		department: 'Marketing',
	},
	{
		id: 39,
		name: 'Raúl',
		email: 'raul@mail.com',
		role: 'Moderator',
		country: 'México',
		createdAt: '2024-01-18',
		status: 'active',
		department: 'Soporte',
	},
	{
		id: 40,
		name: 'Mónica',
		email: 'monica@mail.com',
		role: 'Admin',
		country: 'Chile',
		createdAt: '2024-04-28',
		status: 'active',
		department: 'IT',
	},
]

const columns: ColumnDef<User, any>[] = [
	{
		accessorKey: 'name',
		header: 'Nombre',
		meta: { enableCopy: true },
	},
	{
		accessorKey: 'email',
		header: 'Email',
		meta: { enableCopy: true },
	},
	{
		accessorKey: 'role',
		header: 'Rol',
		cell: (info) => <Badge>{info.getValue() as string}</Badge>,
	},
	{
		accessorKey: 'country',
		header: 'País',
	},
	{
		accessorKey: 'department',
		header: 'Departamento',
		meta: { enableCopy: true },
	},
	{
		accessorKey: 'status',
		header: 'Estado',
		cell: (info) => {
			const value = info.getValue() as string
			return (
				<Badge bg={value === 'active' ? 'success' : 'secondary'}>
					{value === 'active' ? 'Activo' : 'Inactivo'}
				</Badge>
			)
		},
	},
	{
		accessorKey: 'createdAt',
		header: 'Fecha de creación',
		cell: (info) =>
			new Date(info.getValue() as string).toLocaleDateString('es-AR'),
		meta: { enableCopy: true },
	},
]

function App() {
	const detailsModal = useModal<User>()

  const onDetails = (row: User) => {
		detailsModal.open(row)
	}

	return (
		<div className=''>
			<ModalDialog
				show={detailsModal.isOpen}
				onHide={detailsModal.close}
				title='Details'
			>
        <h3>{detailsModal.data?.email}</h3>
			</ModalDialog>

			<AppTable
				isLoading={false}
				striped
				hover
				columns={columns}
				data={USERS}
				pageSize={10}
				enableSearch
				enableColumnVisibility
				enableRowSelection
				enableColumnResize
				onRowClick={(row) => console.log('Row clicked:', row)}
				onRefetchFn={() => console.log('Refetch')}
				onAddFn={() => console.log('Add')}
				rowActions={(row) => (
					<RowActions
						onEdit={() => onDetails(row)}
						onDetails={() => onDetails(row)}
					/>
				)}
			/>
		</div>
	)
}

export default App
