import { createContext } from 'react'
import type { ThemeModeContextType } from './theme-mode.provider'

export const themeModeContext: React.Context<ThemeModeContextType | undefined> =
	createContext<ThemeModeContextType | undefined>(undefined)
