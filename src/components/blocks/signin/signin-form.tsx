

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeClosed, Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { type SignInValues, signInschema } from './signin-validation-schema'

export default function SignInForm() {
	const [showPassword, setShowPassword] = useState(false)

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignInValues>({
		resolver: zodResolver(signInschema),
	})

	const onSubmit = (data: SignInValues) => {
		console.log('Sign in:', data)
	}

	return (
		<Form onSubmit={handleSubmit(onSubmit)} noValidate>
			<Form.Group className='mb-3' controlId='email'>
				<Form.Label>Correo electrónico</Form.Label>
				<div className='input-group'>
					<span className='input-group-text'>
						<Mail aria-hidden />
					</span>
					<Form.Control
						type='email'
						placeholder='correo@ejemplo.com'
						isInvalid={!!errors.email}
						{...register('email')}
					/>
					<Form.Control.Feedback type='invalid'>
						{errors.email?.message}
					</Form.Control.Feedback>
				</div>
			</Form.Group>

			<Form.Group className='mb-3' controlId='password'>
				<Form.Label>Contraseña</Form.Label>
				<div className='input-group'>
					<span className='input-group-text'>
						<Lock aria-hidden />
						<span>
							<span className='visually-hidden'>Mostrar contraseña</span>
						</span>
					</span>
					<Form.Control
						type={showPassword ? 'text' : 'password'}
						placeholder='••••••••'
						isInvalid={!!errors.password}
						{...register('password')}
					/>
					<Button
						variant='outline-secondary'
						onClick={() => setShowPassword((v) => !v)}
						tabIndex={-1}
					>
						{showPassword ? <EyeClosed /> : <Eye />}
					</Button>
					<Form.Control.Feedback type='invalid'>
						{errors.password?.message}
					</Form.Control.Feedback>
				</div>
			</Form.Group>

			<div className='d-flex justify-content-between align-items-center mb-4'>
				<Form.Check type='checkbox' label='Recordarme' />
				<a href='#' className='text-decoration-none small'>
					¿Olvidaste tu contraseña?
				</a>
			</div>

			<Button
				type='submit'
				variant='primary'
				className='w-100 py-2'
				disabled={isSubmitting}
			>
				{isSubmitting ? 'Ingresando...' : 'Iniciar sesión'}
			</Button>
		</Form>
	)
}
