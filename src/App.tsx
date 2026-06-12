import { Button } from 'react-bootstrap'
import './App.css'
import { X } from 'lucide-react'
import AnimalAvatar from './components/shared/animal-avatar'
import { Avatar } from './components/shared/avatar'
import ButtonNeutral from './components/shared/button-neutral'
import IconButton from './components/shared/icon-button'
import { useAlertDialog } from './providers/AlertDialogProvider'
import { useToast } from './providers/ToastProvider'

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
		<div className='p-3'>
			<AnimalAvatar name='Felipe' />
      
			<h1>Admin Horas</h1>
			<p>Bienvenido al panel de administración de horas.</p>

			<IconButton aria-label='close' icon={<X size={20} />} elevation />

			<hr />

			<h2>Buttons</h2>

			<ButtonNeutral>Click me</ButtonNeutral>

			<hr />

			<h2>Alert Dialog</h2>
			<Button onClick={handleShowAlertDialog} variant='secondary'>
				Show Alert Dialog
			</Button>

			<hr />

			<h2>Toast</h2>

			<Button onClick={handleShowToast} variant='secondary'>
				Show Toast
			</Button>
		</div>
	)
}

export default App
