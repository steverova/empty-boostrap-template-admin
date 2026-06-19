import AppTooltip from '@components/shared/tooltip'
import type { Editor } from '@tiptap/react'
import { useState } from 'react'
import Overlay from 'react-bootstrap/Overlay'
import Popover from 'react-bootstrap/Popover'
import {
	colorPickerWrapper,
	colorSwatch,
	toolbarButton,
} from '../editor.styles.css'

const UNDERLINE_COLORS = [
	{ name: 'Rojo', value: '#dc3545' },
	{ name: 'Naranja', value: '#fd7e14' },
	{ name: 'Amarillo', value: '#ffc107' },
	{ name: 'Verde', value: '#198754' },
	{ name: 'Azul', value: '#0d6efd' },
	{ name: 'Morado', value: '#6f42c1' },
	{ name: 'Rosa', value: '#d63384' },
	{ name: 'Celeste', value: '#0dcaf0' },
]

type ToolbarUnderlineColorProps = {
	editor: Editor
}

export default function ToolbarUnderlineColor({ editor }: ToolbarUnderlineColorProps) {
	const [show, setShow] = useState(false)
	const [target, setTarget] = useState<HTMLElement | null>(null)

	const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
		setTarget(e.currentTarget)
		setShow(!show)
	}

	const handleSelect = (color: string) => {
		if (editor.isActive('underlineColor')) {
			editor.chain().focus().setUnderlineColor(color).run()
		} else {
			editor.chain().focus().setUnderlineColor(color).run()
		}
		setShow(false)
	}

	return (
		<>
			<AppTooltip label='Subrayado con color' placement='bottom'>
				<button
					type='button'
					className={toolbarButton}
					data-active={editor.isActive('underlineColor')}
					aria-label='Subrayado con color'
					onClick={handleToggle}
				>
					<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
						<path d='M6 4v6a6 6 0 0 0 12 0V4' />
						<line x1='4' y1='20' x2='20' y2='20' />
					</svg>
				</button>
			</AppTooltip>
			<Overlay
				show={show}
				target={target}
				placement='bottom'
				rootClose
				onHide={() => setShow(false)}
				container={document.querySelector('.modal-body') ?? document.body}
			>
				<Popover style={{ zIndex: 1060 }} onMouseDown={(e: React.MouseEvent) => e.preventDefault()}>
					<Popover.Body>
						<div className={colorPickerWrapper}>
							{UNDERLINE_COLORS.map((c) => (
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
