import { Col, Container, Row } from 'react-bootstrap'
import { svg } from '../../assets/assets'
import SignInForm from '../../components/blocks/signin/signin-form'
import { Link } from 'react-router'

export function Component() {
	return (
		<div className='vh-100 d-flex align-items-center bg-light'>
			<Container fluid className='h-100'>
				<Row className='h-100'>
					<Col
						style={{
							opacity: 0.2,
							backgroundImage: `url(${svg.patters[1]})`,
							WebkitMaskImage:
								'linear-gradient(to right, black 92%, transparent 100%)',
							maskImage:
								'linear-gradient(to right, black 92%, transparent 100%)',
						}}
						lg={6}
						className='d-none d-lg-flex align-items-center justify-content-center bg-primary bg-opacity-10'
					/>

					<Col
						xs={12}
						lg={6}
						className='d-flex align-items-center justify-content-center'
					>
						<div className='w-100' style={{ maxWidth: 400 }}>
							<h2 className='fw-bold mb-1'>Iniciar sesión</h2>
							<p className='text-muted mb-4'>
								Ingresa tus credenciales para continuar
							</p>

              <SignInForm />

              <Link to='/' className='d-block text-start mt-3 text-decoration-none'>
                home
              </Link>
						</div>
					</Col>
				</Row>
			</Container>
		</div>
	)
}
