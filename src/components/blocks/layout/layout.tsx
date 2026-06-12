import { PanelRightClose, PanelRightOpen } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button, Navbar, Offcanvas } from 'react-bootstrap'
import { Outlet } from 'react-router'
import Sidebar from './sidebar'
import UserMenu from './user-menu'

function useMediaQuery(query: string) {
	const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

	useEffect(() => {
		const mql = window.matchMedia(query)
		const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
		mql.addEventListener('change', handler)
		return () => mql.removeEventListener('change', handler)
	}, [query])

	return matches
}

export default function Layout() {
	const [showSidebar, setShowSidebar] = useState(() => {
		const stored = localStorage.getItem('sidebar-visible')
		return stored !== null ? stored === 'true' : true
	})
	const [showOffcanvas, setShowOffcanvas] = useState(false)
	const isMobile = useMediaQuery('(max-width: 991.98px)')

	const handleToggle = () => {
		if (isMobile) {
			setShowOffcanvas(true)
		} else {
			setShowSidebar((prev) => {
				const next = !prev
				localStorage.setItem('sidebar-visible', String(next))
				return next
			})
		}
	}

	return (
		<div className='d-flex vh-100'>
			{!isMobile && showSidebar && <Sidebar />}

			<div className='d-flex flex-column flex-grow-1 overflow-hidden'>
				<Navbar className={`bg-primary-subtle`}>
					<Button
						onClick={handleToggle}
						variant='light'
						className='p-0 p-1 ms-2'
					>
						{(!isMobile && showSidebar) || (isMobile && showOffcanvas) ? (
							<PanelRightOpen aria-label='Cerrar menú' />
						) : (
							<PanelRightClose aria-label='Abrir menú' />
						)}
					</Button>

					<div className='d-flex align-items-end ms-auto'>
						<UserMenu />
					</div>
				</Navbar>

				<Offcanvas
					show={isMobile && showOffcanvas}
					onHide={() => setShowOffcanvas(false)}
					style={{ width: 250 }}
				>
					<Button
						className='p-0 p-1'
						variant='light'
						onClick={() => setShowOffcanvas(false)}
						aria-label='Close'
						style={{
							position: 'fixed',
							top: '0.5rem',
							left: '254px',
							zIndex: 1051,
						}}
					>
						<PanelRightOpen aria-hidden='true' />
					</Button>

					<Offcanvas.Body className='p-0'>
						<Sidebar />
					</Offcanvas.Body>
				</Offcanvas>

				<main className='flex-grow-1 d-flex flex-column overflow-auto bg-primary-subtle '>
					<div className='flex-grow-1 mb-2 mx-1 mx-lg-2 mx-lg-0 rounded-4 bg-light-subtle'>
						<Outlet />
					</div>
				</main>
			</div>
		</div>
	)
}
