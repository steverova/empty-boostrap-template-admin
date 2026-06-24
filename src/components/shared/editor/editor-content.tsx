import type { Editor } from '@tiptap/react'
import { EditorContent as TiptapEditorContent } from '@tiptap/react'
import { containerWidth, contentArea, editorSize } from './editor.styles.css'
import type { EditorSize } from './editor.types'

type ContainerWidth = 'auto' | 'sm' | 'md' | 'lg'

type EditorContentProps = {
	editor: Editor
	size?: EditorSize
	width?: ContainerWidth
}

export default function EditorContent({
	editor,
	size = 'md',
	width = 'auto',
}: EditorContentProps) {
	return (
		<div
			className={`${contentArea} ${editorSize[size]} ${containerWidth[width]}`}
		>
			<TiptapEditorContent editor={editor} />
		</div>
	)
}
