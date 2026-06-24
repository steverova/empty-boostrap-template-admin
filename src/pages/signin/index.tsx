import SignInForm from '@components/blocks/signin/signin-form'
import { useState } from 'react'
import { Alert, Card } from 'react-bootstrap'
import Otp from '@/components/shared/otp'
import Grainient from '@/components/shared/particles/grainient'
import { useThemeMode } from '@/hooks/use-theme-mode'

export function Component() {
	const { themeMode } = useThemeMode()
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
		<div className='vh-100 position-relative overflow-hidden d-flex align-items-center justify-content-center'>
			<style>{`
          .signin-form-wrapper {
            padding-top: env(safe-area-inset-top, 0px);
            padding-bottom: env(safe-area-inset-bottom, 0px);
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

			<div className='position-relative w-100 h-100 d-flex align-items-center justify-content-center signin-form-wrapper'>
				<Card
					className='border-0 shadow-lg rounded-4 w-100'
					style={{ maxWidth: 400 }}
				>
					<Card.Body className='p-3'>
						<SignInForm />

						<div>
							<Alert variant='light'>
								Hemos enviado tu código OTP a [email@example.com]. Por favor,
								verifica tu bandeja de entrada y confirma el código para
								continuar.
							</Alert>

							<Otp
								value={otp6}
								onChange={setOtp6}
								onComplete={(v) => {
									console.log('OTP 6:', v)
								}}
							/>
						</div>
					</Card.Body>
				</Card>
			</div>
		</div>
	)
}
