import type { Editor } from '@tiptap/react'
import { Indent, Outdent } from 'lucide-react'
import ToolbarButton from './toolbar-button'

type ToolbarIndentButtonsProps = {
	editor: Editor
}

export default function ToolbarIndentButtons({ editor }: ToolbarIndentButtonsProps) {
	return (
		<>
			<ToolbarButton
				icon={Indent}
				label='Aumentar sangría'
				tooltip='Aumentar sangría (Tab)'
				action={(e: Editor) => e.chain().focus().indent().run()}
				editor={editor}
			/>
			<ToolbarButton
				icon={Outdent}
				label='Reducir sangría'
				tooltip='Reducir sangría (Shift+Tab)'
				action={(e: Editor) => e.chain().focus().outdent().run()}
				editor={editor}
			/>
		</>
	)
}
