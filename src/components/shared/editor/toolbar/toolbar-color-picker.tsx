import AppTooltip from '@components/shared/tooltip'
import type { Editor } from '@tiptap/react'
import { Palette } from 'lucide-react'
import { useState } from 'react'
import Overlay from 'react-bootstrap/Overlay'
import Popover from 'react-bootstrap/Popover'
import {
	colorPickerWrapper,
	colorSwatch,
	toolbarButton,
} from '../editor.styles.css'

const COLORS = [
	{ name: 'Predeterminado', value: '' },
	{ name: 'Gris', value: '#6c757d' },
	{ name: 'Rojo', value: '#dc3545' },
	{ name: 'Naranja', value: '#fd7e14' },
	{ name: 'Amarillo', value: '#ffc107' },
	{ name: 'Verde', value: '#198754' },
	{ name: 'Celeste', value: '#0dcaf0' },
	{ name: 'Azul', value: '#0d6efd' },
	{ name: 'Morado', value: '#6f42c1' },
	{ name: 'Rosa', value: '#d63384' },
]

type ToolbarColorPickerProps = {
	editor: Editor
}

export default function ToolbarColorPicker({
	editor,
}: ToolbarColorPickerProps) {
	const [show, setShow] = useState(false)
	const [target, setTarget] = useState<HTMLElement | null>(null)

	const currentColor = editor.getAttributes('textStyle').color ?? ''

	const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
		setTarget(e.currentTarget)
		setShow(!show)
	}

	const handleSelect = (color: string) => {
		if (color) {
			editor.chain().focus().setColor(color).run()
		} else {
			editor.chain().focus().unsetColor().run()
		}
		setShow(false)
	}

	return (
		<>
			<AppTooltip label='Color de texto' placement='top'>
				<button
					type='button'
					className={toolbarButton}
					data-active={!!currentColor}
					aria-label='Color de texto'
					onClick={handleToggle}
				>
					<Palette size={16} strokeWidth={2} />
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
							{COLORS.map((c) => (
								<button
									key={c.value}
									type='button'
									className={colorSwatch}
									data-selected={currentColor === c.value}
									style={{ backgroundColor: c.value || 'var(--bs-body-color)' }}
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
