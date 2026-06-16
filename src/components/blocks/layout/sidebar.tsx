import { assets } from '@assets/assets'
import ThemeMode2 from '@components/shared/theme-mode-2'
import NavigationMenu from './navigation-menu'

type SidebarProps = {
	onNavigate?: () => void
}

export default function Sidebar({ onNavigate }: SidebarProps) {
	return (
		<nav
			className={`d-flex flex-column flex-shrink-0 py-3 bg-primary-subtle sidebar`}
			style={{ width: 250, minHeight: 0 }}
		>
			<div className='px-3'>
				<img
					alt='Logo'
					className='img-fluid'
					src={assets.logo.mark}
				/>
			</div>
			<hr />
			<div className='flex-grow-1 sidebar-scroll' style={{ minHeight: 0, overflowY: 'auto' }}>
				<NavigationMenu onNavigate={onNavigate} />
			</div>
			<ThemeMode2 />
		</nav>
	)
}
