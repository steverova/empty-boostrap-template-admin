import { useQuery } from '@tanstack/react-query'
import { RotateCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Container, Image } from 'react-bootstrap'
import { Navigate } from 'react-router'

import forestIlustration from '@/assets/images/ilustrations/forest_pana.svg'
import { api } from '@/libs/axios'
import { userStore } from '@/stores/user-store'

const signOut = async () => {
	const { data } = await api.post('/auth/sign-out')
	userStore.getState().clearUser()
	return data
}

export function Component() {
	const [canRedirect, setCanRedirect] = useState(false)

	const { isSuccess, isError, isPending } = useQuery({
		queryKey: ['auth', 'sign-out'],
		queryFn: signOut,
		retry: false,
	})

	useEffect(() => {
		if (isSuccess || isError) {
			const timer = setTimeout(() => {
				setCanRedirect(true)
			}, 800)

			return () => clearTimeout(timer)
		}
	}, [isSuccess, isError])

	if (canRedirect) {
		return <Navigate to='/signin' replace />
	}

	return (
		<Container
			fluid
			className='d-flex flex-column justify-content-center align-items-center text-center min-vh-100 p-4'
		>
			<div className='position-relative mb-4' style={{ maxWidth: '400px' }}>
				<Image src={forestIlustration} alt='Signing out illustration' fluid />

				<div className='position-absolute top-0 end-0 p-2'>
					<RotateCw size={40} className={isPending ? 'spin' : ''} />
				</div>
			</div>

			<h1 className='fw-bold mb-3'>Signing Out...</h1>

			<p className='text-muted' style={{ maxWidth: '500px' }}>
				You are being signed out. Please wait a moment while we redirect you to
				the sign-in page.
			</p>
		</Container>
	)
}
