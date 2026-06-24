import { Check } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { useNavigate, useSearchParams } from 'react-router'

export function Component() {
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()
	const [secondsLeft, setSecondsLeft] = useState(3)

	useEffect(() => {
		if (searchParams.get('verified') !== 'true') {
			navigate('/', { replace: true })
			return
		}

		const channel = new BroadcastChannel('auth')
		channel.postMessage({ type: 'AUTH_SUCCESS' })
		channel.close()

		const countdownInterval = setInterval(() => {
			setSecondsLeft((prev) => prev - 1)
		}, 1000)

		const timer = setTimeout(() => {
			window.close()
		}, 3000)

		return () => {
			clearInterval(countdownInterval)
			clearTimeout(timer)
		}
	}, [navigate, searchParams])

	return (
		<Container
			fluid
			className='d-flex flex-column justify-content-center align-items-center text-center min-vh-100 p-4'
		>
			<div
				className='rounded-circle d-flex justify-content-center align-items-center mb-4'
				style={{
					width: 140,
					height: 140,
					backgroundColor: '#d1fae5',
				}}
			>
				<div
					className='rounded-circle d-flex justify-content-center align-items-center'
					style={{
						width: 100,
						height: 100,
						backgroundColor: '#a7f3d0',
					}}
				>
					<Check size={64} color='#047857' />
				</div>
			</div>

			<h1 className='fw-bold mb-2'>Success</h1>

			<h2 className='h4 fw-bold mb-3'>You're all set!</h2>

			<p className='text-muted mb-4'>
				You've been successfully signed in.
				<br />
				You can close this tab and return to the previous one.
			</p>

			<p className='mb-0'>
				This window will close automatically in {secondsLeft} second
				{secondsLeft !== 1 ? 's' : ''}.
			</p>
		</Container>
	)
}
