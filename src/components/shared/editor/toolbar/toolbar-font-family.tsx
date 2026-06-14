import type { Editor } from '@tiptap/react'
import { Type } from 'lucide-react'
import Dropdown from 'react-bootstrap/Dropdown'
import { toolbarButton } from '../editor.styles.css'
import AppTooltip from '@components/shared/tooltip'

const FONTS = [
	{ label: 'Predeterminado', value: '' },
	{ label: 'Arial', value: 'Arial, sans-serif' },
	{ label: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
	{ label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
	{ label: 'Georgia', value: 'Georgia, serif' },
	{ label: 'Courier New', value: '"Courier New", Courier, monospace' },
	{ label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
	{ label: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif' },
	{ label: 'Impact', value: 'Impact, sans-serif' },
	{ label: 'Comic Sans MS', value: '"Comic Sans MS", cursive' },
]

type ToolbarFontFamilyProps = {
	editor: Editor
}

export default function ToolbarFontFamily({ editor }: ToolbarFontFamilyProps) {
	const currentFont = editor.getAttributes('textStyle').fontFamily ?? ''

	const currentLabel =
		FONTS.find((f) => f.value === currentFont)?.label ?? 'Predeterminado'

	return (
		<Dropdown as='div' className='d-inline-flex'>
			<AppTooltip label='Fuente' placement='top'>
				<Dropdown.Toggle
					variant=''
					className={toolbarButton}
					style={{ gap: 4, fontSize: 12, width: 'auto', padding: '0 6px' }}
				>
					<Type size={16} strokeWidth={2} />
					<span style={{ fontSize: 11, maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
						{currentLabel}
					</span>
				</Dropdown.Toggle>
			</AppTooltip>
			<Dropdown.Menu style={{ maxHeight: 300, overflowY: 'auto' }}>
				{FONTS.map((font) => (
					<Dropdown.Item
						key={font.value}
						active={currentFont === font.value}
						style={{ fontFamily: font.value || 'inherit' }}
						onClick={() => {
							if (font.value) {
								editor
									.chain()
									.focus()
									.setMark('textStyle', { fontFamily: font.value })
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
						{font.label}
					</Dropdown.Item>
				))}
			</Dropdown.Menu>
		</Dropdown>
	)
}
