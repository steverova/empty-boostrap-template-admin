import { Link } from 'react-router'
import { ilustrations } from '@/assets/svg/ilustrations'

export default function NotFound() {
	return (
		<div className='h-100 d-flex flex-column align-items-center justify-content-center'>
			<img
				className='img-fluid'
				style={{ maxHeight: '90vh', maxWidth: '100%' }}
				alt='not found route'
				src={ilustrations['404']}
			/>

			<Link className='btn btn-primary' to='/'>
			  Back
			</Link>
		</div>
	)
}
