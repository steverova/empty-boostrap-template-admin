import { useEffect, useState } from 'react'
import { Toast, ToastContainer } from 'react-bootstrap'
import useToastStore from './toastStore'

type ToastLocal = {
	id: string
	title?: string
	message?: string
	variant?: string
	autoHide?: number | false
}

function ToastItem({
	t,
	onHide,
}: {
	t: ToastLocal
	onHide: (id: string) => void
}) {
	const totalMs =
		t.autoHide === false
			? null
			: typeof t.autoHide === 'number'
				? t.autoHide
				: 3000
	const [remainingMs, setRemainingMs] = useState<number | null>(totalMs)

	useEffect(() => {
		if (totalMs == null) return
		setRemainingMs(totalMs)
		const start = Date.now()
		const iv = setInterval(() => {
			const elapsed = Date.now() - start
			const rem = Math.max(0, totalMs - elapsed)
			setRemainingMs(rem)
		}, 200)
		return () => clearInterval(iv)
	}, [totalMs])

	const seconds = remainingMs != null ? Math.ceil(remainingMs / 1000) : null

	return (
		<Toast
			animation
			key={t.id}
			onClose={() => onHide(t.id)}
			show
			bg={t.variant ?? 'dark'}
			className='text-white'
			delay={totalMs ?? undefined}
			autohide={totalMs != null}
		>
			{(t.title || t.message) && (
				// Make header background transparent so it matches the toast body
				<Toast.Header
					closeButton
					className='bg-transparent text-white border-0'
				>
					<strong className='me-auto'>{t.title}</strong>
					{seconds !== null && (
						<small className='text-dark ms-2 bg-white px-2 rounded-3 '>
							Cierra en {seconds}s
						</small>
					)}
				</Toast.Header>
			)}
			{t.message && <Toast.Body>{t.message}</Toast.Body>}
		</Toast>
	)
}

export default function AppToast() {
	const toasts = useToastStore((s) => s.toasts)
	const hide = useToastStore((s) => s.hide)

	return (
		// Force fixed positioning so toasts don't move with page scroll
		<ToastContainer
			position='bottom-center'
			className='p-3'
			style={{ position: 'fixed', zIndex: 1060, bottom: '1rem', right: '1rem' }}
		>
			{toasts.map((t) => (
				<ToastItem key={t.id} t={t as ToastLocal} onHide={hide} />
			))}
		</ToastContainer>
	)
}
