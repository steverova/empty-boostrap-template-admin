import { Monitor, Moon, Sun } from 'lucide-react'
import type { JSX } from 'react'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'

import { useThemeMode } from '../../hooks/use-theme-mode'

type ThemeMode = 'light' | 'dark' | 'system'

const themeOptions: {
	value: ThemeMode
	icon: JSX.Element
}[] = [
	{
		value: 'light',
		icon: <Sun size={18} />,
	},
	{
		value: 'dark',
		icon: <Moon size={18} />,
	},
	{
		value: 'system',
		icon: <Monitor size={18} />,
	},
]

export default function ThemeMode2(): JSX.Element {
	const { themeMode, setThemeMode } = useThemeMode()

	return (
		<ButtonGroup className='px-2'>
			{themeOptions.map(({ value, icon }) => (
				<ToggleButton
					key={value}
					size='sm'
					id={`theme-${value}`}
					type='radio'
					variant='outline-secondary'
					name='theme'
					value={value}
					checked={themeMode === value}
					onChange={() => setThemeMode(value)}
				>
					{icon}
				</ToggleButton>
			))}
		</ButtonGroup>
	)
}
