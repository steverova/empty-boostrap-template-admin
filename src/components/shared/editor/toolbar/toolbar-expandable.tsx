import type { Editor } from '@tiptap/react'
import { ChevronDown } from 'lucide-react'
import ToolbarButton from './toolbar-button'

type ToolbarExpandableProps = {
	editor: Editor
}

export default function ToolbarExpandable({ editor }: ToolbarExpandableProps) {
	return (
		<ToolbarButton
			icon={ChevronDown}
			label='Sección expandible'
			tooltip='Insertar sección expandible / colapsable'
			action={(e: Editor) => e.chain().focus().setExpandable().run()}
			editor={editor}
		/>
	)
}
