import type { Editor } from '@tiptap/react'
import { FileDown } from 'lucide-react'
import ToolbarButton from './toolbar-button'

type ToolbarPageBreakProps = {
	editor: Editor
}

export default function ToolbarPageBreak({ editor }: ToolbarPageBreakProps) {
	return (
		<ToolbarButton
			icon={FileDown}
			label='Salto de página'
			tooltip='Insertar salto de página (para PDF/Word)'
			action={(e: Editor) => e.chain().focus().setPageBreak().run()}
			editor={editor}
		/>
	)
}
