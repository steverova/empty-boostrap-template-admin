import {
	createContext,
	type JSX,
	type ReactNode,
	useCallback,
	useContext,
	useMemo,
	useRef,
	useState
} from 'react'

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */

type ToastOptions = {
	title: string
	message?: string
	autoHide?: boolean
	delay?: number
	position?:
		| 'top-left'
		| 'top-right'
		| 'top-center'
		| 'bottom-center'
		| 'bottom-left'
		| 'bottom-right'
	iconVariant?: 'success' | 'danger' | 'info' | 'warning'
	variant?:
		| 'primary'
		| 'secondary'
		| 'success'
		| 'danger'
		| 'warning'
		| 'info'
		| 'dark'
		| 'light'
}

type ToastItem = ToastOptions & {
	id: string
	createdAt: number
}

type ToastContextType = {
	showToast: (options: ToastOptions) => void
}

type ToastProviderProps = {
	children: ReactNode
	maxStack?: number
}

/* -------------------------------------------------------------------------- */
/*                                   CONTEXT                                  */
/* -------------------------------------------------------------------------- */

const ToastContext: React.Context<ToastContextType | undefined> = createContext<
	ToastContextType | undefined
>(undefined)

// eslint-disable-next-line react-refresh/only-export-components
export function useToast(): ToastContextType {
	const context = useContext(ToastContext)
	if (!context) {
		throw new Error('useToast must be used within a ToastProvider')
	}
	return context
}

/* -------------------------------------------------------------------------- */
/*                                  PROVIDER                                  */
/* -------------------------------------------------------------------------- */

export function ToastProvider({
	children,
	maxStack = 3
}: ToastProviderProps): JSX.Element {
	const [toasts, setToasts] = useState<ToastItem[]>([])
	const [countdowns, setCountdowns] = useState<Record<string, number>>({})
	const timersRef = useRef<Map<string, number>>(new Map())
	const countdownRef = useRef<Map<string, number>>(new Map())

	/* -------------------------------- CONSTANTS ------------------------------- */

	const positions = useMemo(
		() => ({
			'top-left': 'top-0 start-0',
			'top-right': 'top-0 end-0',
			'top-center': 'top-0 start-50 translate-middle-x',
			'bottom-center': 'bottom-0 start-50 translate-middle-x',
			'bottom-left': 'bottom-0 start-0',
			'bottom-right': 'bottom-0 end-0'
		}),
		[]
	)

	const variantIcons: Record<string, JSX.Element> = useMemo(
		() => ({
			success: <i className='bi bi-check2-circle' />,
			danger: <i className='bi bi-exclamation-octagon-fill' />,
			info: <i className='bi bi-info-circle-fill' />,
			warning: <i className='bi bi-exclamation-triangle-fill' />
		}),
		[]
	)

	/* ------------------------------- ACTIONS --------------------------------- */

	const hideToast = useCallback((id: string) => {
		const timer = timersRef.current.get(id)
		if (timer) {
			clearTimeout(timer)
			timersRef.current.delete(id)
		}
		setToasts((prev) => prev.filter((t) => t.id !== id))
	}, [])

	const showToast = useCallback(
		(options: ToastOptions) => {
			const id = crypto.randomUUID()
			const delay = options.delay ?? 8000

			const toast: ToastItem = {
				id,
				title: options.title,
				message: options.message,
				autoHide: options.autoHide ?? true,
				delay,
				iconVariant: options.iconVariant,
				variant: options.variant ?? 'primary',
				position: options.position ?? 'bottom-right',
				createdAt: Date.now()
			}

			setToasts((prev) => [...prev, toast].slice(-maxStack))

			if (toast.autoHide) {
			// Countdown actualización cada segundo para mostrar el badge
			const countdownInterval = window.setInterval(() => {
				const remaining = Math.max(0, delay - (Date.now() - toast.createdAt))
				const remainingSec = Math.ceil(remaining / 1000)
				countdownRef.current.set(id, remainingSec)
				// Actualizar estado solo cada segundo
				setCountdowns((prev) => ({ ...prev, [id]: remainingSec }))
			}, 1000)

				const timer = window.setTimeout(() => {
					clearInterval(countdownInterval)
					countdownRef.current.delete(id)
					hideToast(id)
				}, delay)

				timersRef.current.set(id, timer)
			}
		},
		[hideToast, maxStack]
	)

	/* ------------------------- GLOBAL COUNTDOWN TICK ------------------------- */

	// NO usar interval global - confiar en timeouts individuales
	// El countdown visual se puede hacer sin re-renders usando CSS

	/* -------------------------------- PROVIDER ------------------------------- */

	return (
		<ToastContext.Provider value={{ showToast }}>
			{children}

			{Object.entries(positions).map(([position, positionClass]) => {
				const stack = toasts.filter((t) => t.position === position)
				if (!stack.length) return null

				return (
					<div
						className={`toast-container position-fixed p-3 ${positionClass}`}
						key={position}
						style={{ zIndex: 9999 }}>
						{stack.map((toast, index) => {
							const remainingSec = toast.autoHide
								? countdowns[toast.id] ?? Math.ceil((toast.delay ?? 8000) / 1000)
								: null

							return (
								<div
									aria-atomic='true'
									aria-live='assertive'
									className='toast show mb-2'
									key={toast.id}
									role='alert'
									style={{
										animation: 'toast-in 250ms ease-out',
										transform: `translateY(${index * 4}px) scale(${1 - index * 0.03})`,
										opacity: 1 - index * 0.15,
										transition: 'all 200ms ease'
									}}>
									<div className={`toast-header text-bg-${toast.variant}`}>
										{toast.iconVariant && (
											<span className='me-2'>
												{variantIcons[toast.iconVariant]}
											</span>
										)}
										<strong className='me-auto'>{toast.title}</strong>

										{toast.autoHide && remainingSec !== null && (
											<span className='ms-2 badge rounded-pill bg-light text-dark'>
												{remainingSec}s
											</span>
										)}

										<button
											aria-label='Close'
											className='btn-close btn-close-white ms-2'
											onClick={() => hideToast(toast.id)}
											type='button'
										/>
									</div>

									{toast.message && (
										<div className='toast-body'>{toast.message}</div>
									)}
								</div>
							)
						})}
					</div>
				)
			})}

			<style>
				{`
				@keyframes toast-in {
					from {
						opacity: 0;
						transform: translateY(12px) scale(0.95);
					}
					to {
						opacity: 1;
						transform: translateY(0) scale(1);
					}
				}
			`}
			</style>
		</ToastContext.Provider>
	)
}
