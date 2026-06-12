import { assets } from '../../../assets/assets'
import ThemeMode2 from '../../shared/theme-mode-2'
import NavigationMenu from './navigation-menu'

export default function Sidebar() {
	return (
		<nav
			className={`d-flex flex-column flex-shrink-0 py-3 bg-primary-subtle sidebar`}
			style={{ width: 250 }}
		>
			<div className='px-3'>
				<img
					alt='Logo'
					className='img-fluid'
					src={assets.logo.mark}
				/>
			</div>
			<hr />
			<NavigationMenu />
			<ThemeMode2 />
		</nav>
	)
}
