import { Check, X } from 'lucide-react'
import type { ReactNode } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

type ModalDialogProps = {
	size?: 'sm' | 'lg' | 'xl'
	show: boolean
	title: string
	children: ReactNode
	onHide: () => void
	onConfirm?: () => void | Promise<void>
}

export default function ModalDialog({
	size = 'lg',
	show,
	title,
	children,
	onHide,
	onConfirm,
}: ModalDialogProps) {
	return (
		<Modal
			show={show}
			onHide={onHide}
			backdrop='static'
			scrollable
			size={size}
			centered
			aria-labelledby='modal-dialog-title'
		>
			<Modal.Header closeButton className='border-0'>
				<Modal.Title id='modal-dialog-title'>{title}</Modal.Title>
			</Modal.Header>

			<Modal.Body>{children}</Modal.Body>

			<Modal.Footer className='border-0 shadow'>
				<Button
					variant='outline-secondary'
					onClick={onHide}
					aria-label='Close dialog'
				>
					<X aria-hidden='true' size={18} /> Close
				</Button>

				<Button
					variant='primary'
					onClick={onConfirm}
					aria-label='Confirm action'
				>
					<Check aria-hidden='true' size={18} /> Ok
				</Button>
			</Modal.Footer>
		</Modal>
	)
}
