import type { Editor } from '@tiptap/react'
import { Columns2 } from 'lucide-react'
import ToolbarButton from './toolbar-button'

type ToolbarColumnsButtonProps = {
	editor: Editor
}

export default function ToolbarColumnsButton({ editor }: ToolbarColumnsButtonProps) {
	return (
		<ToolbarButton
			icon={Columns2}
			label='Dos columnas'
			tooltip='Insertar layout de dos columnas'
			action={(e: Editor) => {
				if (e.isActive('twoColumns')) {
					e.chain().focus().lift('twoColumns').run()
				} else {
					e.chain()
						.focus()
						.insertContent({
							type: 'twoColumns',
							content: [
								{ type: 'columnBlock', content: [{ type: 'paragraph' }] },
								{ type: 'columnBlock', content: [{ type: 'paragraph' }] },
							],
						})
						.run()
				}
			}}
			isActive={(e: Editor) => e.isActive('twoColumns')}
			editor={editor}
		/>
	)
}
