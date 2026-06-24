import { Check, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { Spinner } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

type ModalDialogProps = {
	isLoading?: boolean
	size?: 'sm' | 'lg' | 'xl' | undefined
	show: boolean
	title?: string
	children: ReactNode
	onHide: () => void
	onConfirm?: () => void | Promise<void>
}

export default function ModalDialog({
	isLoading = false,
	size,
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
			{...(size && { size })}
			centered
			aria-labelledby='modal-dialog-title'
		>
			<Modal.Header closeButton className='border-0 px-3 py-2'>
				{title && <Modal.Title id='modal-dialog-title'>{title}</Modal.Title>}
			</Modal.Header>

			<Modal.Body>{children}</Modal.Body>

			<Modal.Footer className='border-0 shadow p-1'>
				<Button
					disabled={isLoading}
					variant='outline-secondary'
					onClick={onHide}
					aria-label='Close dialog'
				>
					<X aria-hidden='true' size={18} /> Close
				</Button>

				<Button
					disabled={isLoading}
					variant='primary'
					onClick={onConfirm}
					aria-label='Confirm action'
				>
					{isLoading && (
						<span>
							<Spinner aria-hidden='true' size='sm' /> Loading...
						</span>
					)}
					{!isLoading && (
						<span>
							<Check aria-hidden='true' size={18} /> Ok
						</span>
					)}
				</Button>
			</Modal.Footer>
		</Modal>
	)
}
