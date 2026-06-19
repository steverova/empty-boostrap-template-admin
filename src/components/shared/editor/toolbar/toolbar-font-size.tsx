import type { Editor } from '@tiptap/react'
import { ALargeSmall } from 'lucide-react'
import Dropdown from 'react-bootstrap/Dropdown'
import { toolbarButton } from '../editor.styles.css'
import AppTooltip from '@components/shared/tooltip'

type ToolbarFontSizeProps = {
	editor: Editor
}

const FONT_SIZES = [
	{ label: 'Pequeño', value: '12px' },
	{ label: 'Normal', value: '' },
	{ label: 'Mediano', value: '16px' },
	{ label: 'Grande', value: '20px' },
	{ label: 'Muy grande', value: '24px' },
	{ label: 'Enorme', value: '32px' },
	{ label: 'Gigante', value: '48px' },
]

export default function ToolbarFontSize({ editor }: ToolbarFontSizeProps) {
	const currentSize =
		editor.getAttributes('textStyle').fontSize ?? ''

	const currentLabel =
		FONT_SIZES.find((s) => s.value === currentSize)?.label ?? 'Normal'

	return (
		<Dropdown as='div' className='d-inline-flex'>
			<AppTooltip label='Tamaño de texto' placement='bottom'>
				<Dropdown.Toggle
					variant=''
					className={toolbarButton}
					style={{ gap: 4, fontSize: 12, width: 'auto', padding: '0 6px' }}
				>
					<ALargeSmall size={16} strokeWidth={2} />
					<span style={{ fontSize: 11 }}>{currentLabel}</span>
				</Dropdown.Toggle>
			</AppTooltip>
			<Dropdown.Menu>
				{FONT_SIZES.map((size) => (
					<Dropdown.Item
						key={size.value}
						active={currentSize === size.value}
						onClick={() => {
							if (size.value) {
								editor
									.chain()
									.focus()
									.setMark('textStyle', { fontSize: size.value })
									.run()
							} else {
								editor
									.chain()
									.focus()
									.unsetMark('textStyle')
									.run()
							}
						}}
					>
						{size.label}
					</Dropdown.Item>
				))}
			</Dropdown.Menu>
		</Dropdown>
	)
}
