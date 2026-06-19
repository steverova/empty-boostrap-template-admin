import { useState } from 'react'
import { Alert, Badge } from 'react-bootstrap'
import Otp from '@/components/shared/otp'

export function Component() {
	const [otp4, setOtp4] = useState('')
	const [otp6, setOtp6] = useState('')
	const [otpCustom, setOtpCustom] = useState('')

	const [completed4, setCompleted4] = useState(false)
	const [completed6, setCompleted6] = useState(false)

	return (
		<div className='container py-4'>
			<h4 className='mb-4'>OTP Input</h4>

			<div className='d-flex flex-column gap-5' style={{ maxWidth: 480 }}>
				<div>
					<h6 className='mb-2'>
						4 dígitos
						{completed4 && (
							<Badge bg='success' className='ms-2'>Completado</Badge>
						)}
					</h6>
					<Otp
						length={4}
						value={otp4}
						onChange={setOtp4}
						onComplete={(v) => {
							setCompleted4(true)
							console.log('OTP 4:', v)
						}}
					/>
					{otp4 && (
						<p className='mt-2 text-muted small mb-0'>
							Valor: <code>{otp4}</code>
						</p>
					)}
				</div>

				<hr />

				<div>
					<h6 className='mb-2'>
						6 dígitos (por defecto)
						{completed6 && (
							<Badge bg='success' className='ms-2'>Completado</Badge>
						)}
					</h6>
					<Otp
						value={otp6}
						onChange={setOtp6}
						onComplete={(v) => {
							setCompleted6(true)
							console.log('OTP 6:', v)
						}}
					/>
					{otp6 && (
						<p className='mt-2 text-muted small mb-0'>
							Valor: <code>{otp6}</code>
						</p>
					)}
				</div>

				<hr />

				<div>
					<h6 className='mb-2'>Personalizado (color accent)</h6>
					<Otp
						length={5}
						value={otpCustom}
						onChange={setOtpCustom}
						accentColor='#198754'
					/>
				</div>

				<hr />

				<div>
					<h6 className='mb-2'>Deshabilitado</h6>
					<Otp length={6} value='123456' disabled />
				</div>

				<Alert variant='info' className='small mb-0'>
					<strong>Instrucciones:</strong> Escribe dígitos, usa <code>Backspace</code> para borrar,
					flechas para navegar, y <code>Ctrl+V</code> para pegar un código completo.
				</Alert>
			</div>
		</div>
	)
}
