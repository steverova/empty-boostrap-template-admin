import AppTooltip from '@components/shared/tooltip'
import type { Editor } from '@tiptap/react'
import { Highlighter } from 'lucide-react'
import { useState } from 'react'
import Overlay from 'react-bootstrap/Overlay'
import Popover from 'react-bootstrap/Popover'
import {
	colorPickerWrapper,
	colorSwatch,
	toolbarButton,
} from '../editor.styles.css'

const HIGHLIGHT_COLORS = [
	{ name: 'Amarillo', value: '#fff3bf' },
	{ name: 'Verde claro', value: '#b2f2bb' },
	{ name: 'Azul claro', value: '#a5d8ff' },
	{ name: 'Rosa', value: '#fcc2d7' },
	{ name: 'Naranja', value: '#ffd8a8' },
	{ name: 'Morado', value: '#d0bfff' },
	{ name: 'Rojo claro', value: '#ffc9c9' },
	{ name: 'Celeste', value: '#99e9f2' },
]

type ToolbarHighlightButtonProps = {
	editor: Editor
}

export default function ToolbarHighlightButton({ editor }: ToolbarHighlightButtonProps) {
	const [show, setShow] = useState(false)
	const [target, setTarget] = useState<HTMLElement | null>(null)

	const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
		setTarget(e.currentTarget)
		setShow(!show)
	}

	const handleSelect = (color: string) => {
		editor.chain().focus().toggleHighlight({ color }).run()
		setShow(false)
	}

	return (
		<>
			<AppTooltip label='Resaltar texto' placement='top'>
				<button
					type='button'
					className={toolbarButton}
					data-active={editor.isActive('highlight')}
					aria-label='Resaltar texto'
					onClick={handleToggle}
				>
					<Highlighter size={16} strokeWidth={2} />
				</button>
			</AppTooltip>
			<Overlay
				show={show}
				target={target}
				placement='bottom'
				rootClose
				onHide={() => setShow(false)}
			>
				<Popover onMouseDown={(e: React.MouseEvent) => e.preventDefault()}>
					<Popover.Body>
						<div className={colorPickerWrapper}>
							{HIGHLIGHT_COLORS.map((c) => (
								<button
									key={c.value}
									type='button'
									className={colorSwatch}
									style={{ backgroundColor: c.value }}
									aria-label={c.name}
									title={c.name}
									onClick={() => handleSelect(c.value)}
								/>
							))}
						</div>
					</Popover.Body>
				</Popover>
			</Overlay>
		</>
	)
}
