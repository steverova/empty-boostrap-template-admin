import type React from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { X } from 'lucide-react'

type ModalDialogProps = {
	show: boolean
	title: string
	children: React.ReactNode
	onHide: () => void
}

export default function ModalDialog(props: ModalDialogProps) {
	const { title, children } = props

	return (
		<Modal
			className=''
			{...props}
			backdrop='static'
			scrollable
			size='lg'
			aria-labelledby='contained-modal-title-vcenter'
			centered
		>
			<Modal.Header className='border-0' closeButton>
				<Modal.Title id='contained-modal-title-vcenter'>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>{children}</Modal.Body>
			<Modal.Footer className='border-0 shadow'>
				<Button
					variant='dark'
					className='bg-purple-lenovo text-white'
					onClick={props.onHide}
					aria-label={t('buttons.close')}
				>
					<X aria-hidden='true' /> 'Cerrar'
				</Button>
			</Modal.Footer>
		</Modal>
	)
}
