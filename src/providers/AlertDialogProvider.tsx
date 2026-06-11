import {
	createContext,
	type JSX,
	type ReactNode,
	useCallback,
	useContext,
	useRef,
	useState,
} from 'react'
import { Modal } from 'react-bootstrap'
import { Check, X } from 'lucide-react'
import ButtonNeutral from '../components/shared/button-neutral'

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
	const [show, setShow] = useState(false)
	const [options, setOptions] = useState<AlertDialogOptions>({})
	const [loading, setLoading] = useState(false)

	const resolveRef = useRef<(value: boolean) => void>()
	const resolvedRef = useRef(false)

	/* ------------------------------ PUBLIC API ------------------------------ */

	const showAlertDialog = useCallback(
		(opts: AlertDialogOptions): Promise<boolean> => {
			return new Promise<boolean>((resolve) => {
				resolveRef.current = resolve
				resolvedRef.current = false

				setOptions({
					cancelText: 'Cancelar',
					confirmText: 'Continuar',
					promise: false,
					...opts,
				})
				setLoading(false)
				setShow(true)
			})
		},
		[],
	)

	const closePromise = (): void => {
		setLoading(false)
		setShow(false)
	}

	/* ------------------------------ HANDLERS ------------------------------ */

	const handleClose = (): void => {
		if (resolvedRef.current) return
		resolvedRef.current = true
		resolveRef.current?.(false)
		setShow(false)
	}

	const handleConfirm = (): void => {
		if (resolvedRef.current) return
		resolvedRef.current = true
		resolveRef.current?.(true)

		if (options.promise) {
			setLoading(true)
			return
		}

		setShow(false)
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
				show={show}
				backdrop='static'
				keyboard={false}
				centered
				aria-labelledby='alert-dialog-title'
				aria-describedby='alert-dialog-message'
			>
				<Modal.Header className='border-0'>
					<Modal.Title id='alert-dialog-title' className='fw-bold'>
						{options.title}
					</Modal.Title>
				</Modal.Header>

				<Modal.Body id='alert-dialog-message'>
					{options.message && <p className='mb-2'>{options.message}</p>}
					{options.content}
				</Modal.Body>

				<Modal.Footer className='border-0'>
					<ButtonNeutral
						disabled={loading}
						startIcon={<X />}
						onClick={handleClose}
						type='button'
						outline
					>
						{options.cancelText}
					</ButtonNeutral>

					<ButtonNeutral
						disabled={loading}
						loading={loading}
						startIcon={<Check />}
						onClick={handleConfirm}
						type='button'
					>
						{options.confirmText}
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
