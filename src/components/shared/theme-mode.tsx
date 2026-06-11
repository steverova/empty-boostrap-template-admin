import { Monitor, Moon, Sun } from 'lucide-react'
import type { JSX } from 'react'
import { useThemeMode } from '../../hooks/use-theme-mode'

export default function ThemeMode(): JSX.Element {
	const { setThemeMode, themeMode } = useThemeMode()

	const icons: Record<'light' | 'dark', JSX.Element> = {
		light: <Moon />,
		dark: <Sun />,
		system: <Monitor />,
	}

	const toggleTheme = (): void => {
		if (themeMode === 'light') {
			setThemeMode('dark')
		} else {
			setThemeMode('light')
		}
	}

	const currentIcon = themeMode === 'system' ? icons.light : icons[themeMode]

	return (
		<button className='btn btn-ghost' onClick={toggleTheme} type='button'>
			{currentIcon}
		</button>
	)
}
