import { Badge } from 'react-bootstrap'
import './App.css'
import { X } from 'lucide-react'
import AnimalAvatar from './components/shared/animal-avatar'
import AppTable from './components/shared/app-table'
import { Avatar } from './components/shared/avatar'
import ButtonNeutral from './components/shared/button-neutral'
import IconButton from './components/shared/icon-button'
import { useAlertDialog } from './providers/AlertDialogProvider'
import { useToast } from './providers/ToastProvider'

interface User {
	id: number
	name: string
	email: string
	role: string
}

const USERS: User[] = [
  { id: 1, name: 'Juan', email: 'juan@mail.com', role: 'Admin' },
  { id: 2, name: 'Ana', email: 'ana@mail.com', role: 'User' },
  { id: 3, name: 'Carlos', email: 'carlos@mail.com', role: 'User' },
  { id: 4, name: 'María', email: 'maria@mail.com', role: 'Editor' },
  { id: 5, name: 'Pedro', email: 'pedro@mail.com', role: 'Admin' },
  { id: 6, name: 'Laura', email: 'laura@mail.com', role: 'User' },
  { id: 7, name: 'Diego', email: 'diego@mail.com', role: 'Moderator' },
  { id: 8, name: 'Sofía', email: 'sofia@mail.com', role: 'Viewer' },
  { id: 9, name: 'Luis', email: 'luis@mail.com', role: 'Editor' },
  { id: 10, name: 'Elena', email: 'elena@mail.com', role: 'User' },
  { id: 11, name: 'Pablo', email: 'pablo@mail.com', role: 'Admin' },
  { id: 12, name: 'Clara', email: 'clara@mail.com', role: 'User' },
  { id: 13, name: 'Andrés', email: 'andres@mail.com', role: 'Viewer' },
  { id: 14, name: 'Valentina', email: 'valentina@mail.com', role: 'Editor' },
  { id: 15, name: 'Javier', email: 'javier@mail.com', role: 'Moderator' },
  { id: 16, name: 'Isabel', email: 'isabel@mail.com', role: 'User' },
  { id: 17, name: 'Ricardo', email: 'ricardo@mail.com', role: 'Admin' },
  { id: 18, name: 'Camila', email: 'camila@mail.com', role: 'Viewer' },
  { id: 19, name: 'Fernando', email: 'fernando@mail.com', role: 'Editor' },
  { id: 20, name: 'Gabriela', email: 'gabriela@mail.com', role: 'User' },
  { id: 21, name: 'Tomás', email: 'tomas@mail.com', role: 'Moderator' },
  { id: 22, name: 'Florencia', email: 'florencia@mail.com', role: 'User' },
  { id: 23, name: 'Martín', email: 'martin@mail.com', role: 'Admin' },
  { id: 24, name: 'Victoria', email: 'victoria@mail.com', role: 'Viewer' },
  { id: 25, name: 'Nicolás', email: 'nicolas@mail.com', role: 'Editor' },
  { id: 26, name: 'Paula', email: 'paula@mail.com', role: 'User' },
  { id: 27, name: 'Hugo', email: 'hugo@mail.com', role: 'Moderator' },
  { id: 28, name: 'Daniela', email: 'daniela@mail.com', role: 'Admin' },
  { id: 29, name: 'Emilio', email: 'emilio@mail.com', role: 'User' },
  { id: 30, name: 'Cecilia', email: 'cecilia@mail.com', role: 'Viewer' },
  { id: 31, name: 'Alejandro', email: 'alejandro@mail.com', role: 'Editor' },
  { id: 32, name: 'Natalia', email: 'natalia@mail.com', role: 'User' },
  { id: 33, name: 'Gonzalo', email: 'gonzalo@mail.com', role: 'Moderator' },
  { id: 34, name: 'Renata', email: 'renata@mail.com', role: 'Admin' },
  { id: 35, name: 'Mauricio', email: 'mauricio@mail.com', role: 'User' },
  { id: 36, name: 'Luciana', email: 'luciana@mail.com', role: 'Editor' },
  { id: 37, name: 'Esteban', email: 'esteban@mail.com', role: 'Viewer' },
  { id: 38, name: 'Silvina', email: 'silvina@mail.com', role: 'User' },
  { id: 39, name: 'Raúl', email: 'raul@mail.com', role: 'Moderator' },
  { id: 40, name: 'Mónica', email: 'monica@mail.com', role: 'Admin' },
]

const columns = [
	{ key: 'name' as const, label: 'Nombre' },
	{ key: 'email' as const, label: 'Email' },
	{ key: 'role' as const, label: 'Rol', render: (v: string) => <Badge>{v}</Badge> },
]

function App() {
	const { showToast } = useToast()
	const { showAlertDialog } = useAlertDialog()

	const handleShowToast = () => {
		showToast({
			title: 'Toast Title',
			message: 'This is a toast description.',
			variant: 'success',
			delay: 6000,
		})
	}

	const handleShowAlertDialog = async () => {
		const confirmed = await showAlertDialog({
			title: 'Confirm Action',
			message: 'Are you sure you want to perform this action?',
			showIcon: true,
		})

		console.log('User confirmed:', confirmed)
	}

	return (
		<div className=''>
			<AppTable striped hover columns={columns} data={USERS} pageSize={10} />
		</div>
	)
}

export default App
