import { useContext } from 'react'
import type { ThemeModeContextType } from '../providers/theme-mode/theme-mode.provider'
import { themeModeContext } from '../providers/theme-mode/theme-mode-context'

export function useThemeMode(): ThemeModeContextType {
	const context = useContext(themeModeContext)
	if (!context) {
		throw new Error('useThemeMode must be used within a ThemeModeProvider')
	}
	return context
}
