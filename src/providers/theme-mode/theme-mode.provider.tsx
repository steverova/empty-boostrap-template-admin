import { type JSX, useEffect, useState } from 'react'
import { themeModeContext } from './theme-mode-context'

export const THEME_MODE = {
	LIGHT: 'light',
	DARK: 'dark',
	SYSTEM: 'system'
} as const

export type ThemeModeContextType = {
	themeMode: 'light' | 'dark' | 'system'
	setThemeMode: (mode: 'light' | 'dark' | 'system') => void
}

export const ThemeModeProvider = ({
	children,
}: {
	children: React.ReactNode
}): JSX.Element => {
	const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>(
		() => {
			const saved = localStorage.getItem('themeMode')
			return (saved as 'light' | 'dark' | 'system') || 'light'
		},
	)

	useEffect(() => {
		const root = document.documentElement

		if (themeMode === 'system') {
			const prefersDark = window.matchMedia(
				'(prefers-color-scheme: dark)',
			).matches
			root.setAttribute('data-bs-theme', prefersDark ? 'dark' : 'light')
		} else {
			root.setAttribute('data-bs-theme', themeMode)
		}

		localStorage.setItem('themeMode', themeMode)
	}, [themeMode])

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.altKey && e.shiftKey && e.code === 'KeyD') {
				e.preventDefault()
				setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'))
			}
		}
		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [])

	return (
		<themeModeContext.Provider value={{ themeMode, setThemeMode }}>
			{children}
		</themeModeContext.Provider>
	)
}
