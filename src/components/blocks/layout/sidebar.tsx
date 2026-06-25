import { assets } from '@assets/assets'
import ThemeMode2 from '@components/shared/theme-mode-2'
import ColorThemeSelector from '@components/shared/color-theme-selector'
import NavigationMenu from './navigation-menu'

type SidebarProps = {
	onNavigate?: () => void
}

export default function Sidebar({ onNavigate }: SidebarProps) {
	return (
		<nav
			className={`d-flex flex-column flex-shrink-0 py-3 sidebar`}
			style={{ width: 250, minHeight: 0, backgroundColor: 'var(--app-layout-bg, var(--bs-success-subtle))' }}
		>
			<div className='px-3'>
				<img alt='Logo' className='img-fluid' src={assets.logo.mark} />
			</div>
			<hr />
			<div
				className='flex-grow-1 sidebar-scroll'
				style={{ minHeight: 0, overflowY: 'auto' }}
			>
				<NavigationMenu onNavigate={onNavigate} />
			</div>
			<div className='px-2 d-flex align-items-center gap-2'>
				<ThemeMode2 />
				<ColorThemeSelector />
			</div>
		</nav>
	)
}
