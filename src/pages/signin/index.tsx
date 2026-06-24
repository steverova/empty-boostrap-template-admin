import SignInForm from '@components/blocks/signin/signin-form'
import { useState } from 'react'
import { Alert, Card } from 'react-bootstrap'
import { Link } from 'react-router'
import ModalDialog from '@/components/shared/modal-dialog'
import Otp from '@/components/shared/otp'
import Grainient from '@/components/shared/particles/grainient'
import { useModal } from '@/hooks/use-modal'
import { useThemeMode } from '@/hooks/use-theme-mode'

export function Component() {
	const { themeMode } = useThemeMode()
	const otpModal = useModal()
	const [otp6, setOtp6] = useState('')

	const isDark =
		themeMode === 'dark' ||
		(themeMode === 'system' &&
			window.matchMedia('(prefers-color-scheme: dark)').matches)
	const lightColors = {
		color1: '#e0dede',
		color2: '#161719',
		color3: '#201d24',
	}

	const darkColors = { color1: '#201d24', color2: '#e0dede', color3: '#161719' }
	const colors = isDark ? darkColors : lightColors

	return (
		<>
			<div className='vh-100 position-relative overflow-hidden'>
				<style>{`
            .signin-form-wrapper {
              width: 100%;
              padding: 8px;
            }
            @media (min-width: 992px) {
              .signin-form-wrapper {
                width: 50%;
                padding: 12px 12px 12px 0;
              }
              .signin-card {
                padding: 24px !important;
              }
            }
          `}</style>
				<div className='position-absolute top-0 start-0 w-100 h-100'>
					<Grainient
						color1={colors.color1}
						color2={colors.color2}
						color3={colors.color3}
						timeSpeed={0.25}
						colorBalance={0}
						warpStrength={1}
						warpFrequency={5}
						warpSpeed={2}
						warpAmplitude={50}
						blendAngle={0}
						blendSoftness={0.05}
						rotationAmount={500}
						noiseScale={2}
						grainAmount={0.1}
						grainScale={2}
						grainAnimated={false}
						contrast={1.5}
						gamma={1}
						saturation={1}
						centerX={0}
						centerY={0}
						zoom={0.9}
					/>
				</div>

				<div className='position-absolute top-0 end-0 h-100 signin-form-wrapper'>
					<Card
						className='h-100 border-0 signin-card '
						style={{ borderRadius: 12 }}
					>
						<Card.Body className='d-flex align-items-center justify-content-center p-0'>
							<div className='w-100' style={{ maxWidth: 400 }}>
								<h2 className='fw-bold mb-1 mb-md-2'>Iniciar sesión</h2>
								<p className='text-muted mb-3 mb-md-4'>
									Ingresa tus credenciales para continuar
								</p>
								<SignInForm />
								<Link
									to='/'
									className='d-block text-start mt-3 text-decoration-none'
								>
									home
								</Link>
							</div>
						</Card.Body>
					</Card>
				</div>
			</div>

			<ModalDialog onHide={otpModal.close} show={otpModal.isOpen}>
				<div>
					<Alert variant='light'>
						Hemos enviado tu código OTP a [email@example.com]. Por favor,
						verifica tu bandeja de entrada y confirma el código para continuar.
					</Alert>

					<Otp
						value={otp6}
						onChange={setOtp6}
						onComplete={(v) => {
							console.log('OTP 6:', v)
						}}
					/>
				</div>
			</ModalDialog>
		</>
	)
}
