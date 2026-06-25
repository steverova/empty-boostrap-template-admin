import { applyColorTheme } from '@utils/color-utils'
import { createContext, type JSX, useContext, useEffect, useState } from 'react'

type ColorThemeContextType = {
	color: string
	setColor: (color: string) => void
}

const DEFAULT_COLOR = '#0d6efd'

const ColorThemeContext = createContext<ColorThemeContextType | undefined>(
	undefined,
)

export function ColorThemeProvider({
	children,
}: {
	children: React.ReactNode
}): JSX.Element {
	const [color, setColorState] = useState<string>(() => {
		return localStorage.getItem('accentColor') || DEFAULT_COLOR
	})

	const setColor = (newColor: string) => {
		setColorState(newColor)
		localStorage.setItem('accentColor', newColor)
		applyColorTheme(newColor)
	}

	useEffect(() => {
		applyColorTheme(color)
	}, [color])

	return (
		<ColorThemeContext.Provider value={{ color, setColor }}>
			{children}
		</ColorThemeContext.Provider>
	)
}

export function useColorTheme(): ColorThemeContextType {
	const ctx = useContext(ColorThemeContext)
	if (!ctx)
		throw new Error('useColorTheme must be used within ColorThemeProvider')
	return ctx
}

export { DEFAULT_COLOR }
