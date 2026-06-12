import {
	createContext,
	type JSX,
	type ReactNode,
	useCallback,
	useContext,
	useState,
} from 'react'
import Modal from 'react-bootstrap/Modal'
import { Check, X } from 'lucide-react'
import ButtonNeutral from '@components/shared/button-neutral'

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */

type AlertDialogOptions = {
	title?: string
	message?: string
	content?: ReactNode
	showIcon?: boolean
	cancelText?: string
	confirmText?: string
	promise?: boolean
}

type AlertDialogContextType = {
	showAlertDialog: (options: AlertDialogOptions) => Promise<boolean>
	closePromise: () => void
}

type DialogState = AlertDialogOptions & {
	resolve?: (value: boolean) => void
	resolved?: boolean
}

/* -------------------------------------------------------------------------- */
/*                                   CONTEXT                                  */
/* -------------------------------------------------------------------------- */

const AlertDialogContext = createContext<AlertDialogContextType | null>(null)

/* -------------------------------------------------------------------------- */
/*                                  PROVIDER                                  */
/* -------------------------------------------------------------------------- */

export function AlertDialogProvider({
	children,
}: {
	children: ReactNode
}): JSX.Element {
	const [dialog, setDialog] = useState<DialogState | null>(null)
	const [loading, setLoading] = useState(false)

	/* ------------------------------ PUBLIC API ------------------------------ */

	const showAlertDialog = useCallback(
		(options: AlertDialogOptions): Promise<boolean> => {
			if (dialog) {
				return Promise.resolve(false)
			}

			return new Promise<boolean>((resolve) => {
				setDialog({
					cancelText: 'Cancelar',
					confirmText: 'Continuar',
					promise: false,
					...options,
					resolve,
					resolved: false,
				})
			})
		},
		[dialog],
	)

	const closePromise = (): void => {
		setLoading(false)
		setDialog(null)
	}

	/* ------------------------------ HANDLERS ------------------------------ */

	const handleClose = (): void => {
		if (!dialog) return
		if (dialog.resolved) return
		dialog.resolve?.(false)
		dialog.resolved = true
		setDialog(null)
	}

	const handleConfirm = (): void => {
		if (!dialog) return
		if (dialog.resolved) return
		dialog.resolve?.(true)
		dialog.resolved = true

		if (dialog.promise) {
			setLoading(true)
			return
		}

		setDialog(null)
	}

	/* -------------------------------------------------------------------------- */
	/*                                    RENDER                                  */
	/* -------------------------------------------------------------------------- */

	return (
		<AlertDialogContext.Provider
			value={{
				showAlertDialog,
				closePromise,
			}}
		>
			{children}

			<Modal
				show={dialog !== null}
				onHide={handleClose}
				backdrop='static'
				keyboard={false}
				centered
				aria-labelledby='alert-dialog-title'
				aria-describedby='alert-dialog-message'
			>
				<Modal.Header className='border-0'>
					<Modal.Title id='alert-dialog-title' className='fw-bold'>
						{dialog?.title}
					</Modal.Title>
				</Modal.Header>

				<Modal.Body id='alert-dialog-message'>
					{dialog?.message && <p className='mb-2'>{dialog.message}</p>}
					{dialog?.content}
				</Modal.Body>

				<Modal.Footer className='border-0'>
					<ButtonNeutral
						disabled={loading}
						startIcon={<X size={18} />}
						onClick={handleClose}
						type='button'
						outline
					>
						{dialog?.cancelText}
					</ButtonNeutral>

					<ButtonNeutral
						disabled={loading}
						loading={loading}
						startIcon={<Check size={18} />}
						onClick={handleConfirm}
						type='button'
					>
						{dialog?.confirmText}
					</ButtonNeutral>
				</Modal.Footer>
			</Modal>
		</AlertDialogContext.Provider>
	)
}

/* -------------------------------------------------------------------------- */
/*                                     HOOK                                   */
/* -------------------------------------------------------------------------- */

export function useAlertDialog(): AlertDialogContextType {
	const context = useContext(AlertDialogContext)

	if (!context) {
		throw new Error('useAlertDialog must be used within an AlertDialogProvider')
	}

	return context
}
