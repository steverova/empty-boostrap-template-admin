import { Container, Image } from 'react-bootstrap'
import { Link } from 'react-router'
import { ilustrations } from '@/assets/svg/ilustrations'

export function Component() {
	return (
		<Container
			fluid
			className='d-flex flex-column justify-content-center align-items-center text-center min-vh-100 p-4'
		>
			<Image
				src={ilustrations.invalid_token}
				alt='Invalid token'
				fluid
				className='mb-4'
				style={{ maxWidth: '400px' }}
			/>

			<h1 className='fw-bold mb-3'>Invalid Token</h1>

			<p className='text-muted mb-4' style={{ maxWidth: '500px' }}>
				The token provided is invalid or has expired. Please request a new token
				and try again.
			</p>

			<div className='d-flex gap-2'>
				<Link to='/signin' className='btn btn-primary'>
					Sign In
				</Link>
			</div>
		</Container>
	)
}
