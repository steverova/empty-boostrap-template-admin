import type { Editor } from '@tiptap/react'
import { EditorContent as TiptapEditorContent } from '@tiptap/react'
import { contentArea, editorSize } from './editor.styles.css'
import type { EditorSize } from './editor.types'

type EditorContentProps = {
	editor: Editor
	size?: EditorSize
}

export default function EditorContent({
	editor,
	size = 'md',
}: EditorContentProps) {
	return (
		<div className={`${contentArea} ${editorSize[size]}`}>
			<TiptapEditorContent editor={editor} />
		</div>
	)
}
