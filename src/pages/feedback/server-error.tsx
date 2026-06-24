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
				src={ilustrations.server_error}
				alt='Server error'
				fluid
				className='mb-4'
				style={{ maxWidth: '400px' }}
			/>

			<h1 className='fw-bold mb-3'>500 - Server Error</h1>

			<p className='text-muted mb-4' style={{ maxWidth: '500px' }}>
				Something went wrong on our end. Please try again later.
			</p>

			<Link to='/' className='btn btn-primary'>
				Go Home
			</Link>
		</Container>
	)
}
