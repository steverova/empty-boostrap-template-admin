import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import { Table } from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import TextAlign from '@tiptap/extension-text-align'
import Typography from '@tiptap/extension-typography'
import Underline from '@tiptap/extension-underline'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import ImageResize from 'tiptap-extension-resize-image'
import { common, createLowlight } from 'lowlight'
import { FontSize } from './extensions/font-size'
import { Indent } from './extensions/indent'
import { TwoColumns, ColumnBlock } from './extensions/two-columns'
import { YouTube } from './extensions/youtube'
import { UnderlineColor } from './extensions/underline-color'
import { Callout } from './extensions/callout'
import { Expandable } from './extensions/expandable'
import { PageBreak } from './extensions/page-break'
import { contentArea, editorSize, editorPreview } from './editor.styles.css'
import type { EditorSize } from './editor.types'

const lowlight = createLowlight(common)

type EditorPreviewProps = {
	content?: string
	size?: EditorSize
}

export default function EditorPreview({
	content = '',
	size = 'md',
}: EditorPreviewProps) {
	const extensions: any[] = [
		StarterKit.configure({ codeBlock: false }),
		Highlight.configure({ multicolor: true }),
		Underline,
		UnderlineColor,
		FontSize,
		Indent,
		Color,
		TextAlign.configure({ types: ['heading', 'paragraph'] }),
		Link.configure({ openOnClick: false, autolink: true }),
		ImageResize,
		Table.configure({ resizable: true }),
		TableRow,
		TableCell,
		TableHeader,
		Typography,
		TaskList,
		TaskItem.configure({ nested: true }),
		CodeBlockLowlight.configure({ lowlight }),
		YouTube,
		TwoColumns,
		ColumnBlock,
		Callout,
		Expandable,
		PageBreak,
	]

	const editor = useEditor({
		extensions,
		editable: false,
		content,
	})

	if (!editor) return null

	return (
		<div className={editorPreview}>
			<div className={`${contentArea} ${editorSize[size]}`} style={{ pointerEvents: 'none' }}>
				<EditorContent editor={editor} />
			</div>
		</div>
	)
}
