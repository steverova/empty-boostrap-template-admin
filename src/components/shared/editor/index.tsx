import CharacterCount from '@tiptap/extension-character-count'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { Table } from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import TextAlign from '@tiptap/extension-text-align'
import Typography from '@tiptap/extension-typography'
import Underline from '@tiptap/extension-underline'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import ImageResize from 'tiptap-extension-resize-image'
import { common, createLowlight } from 'lowlight'
import { useEffect } from 'react'
import { FontSize } from './extensions/font-size'
import { Indent } from './extensions/indent'
import { TwoColumns, ColumnBlock } from './extensions/two-columns'
import { YouTube } from './extensions/youtube'
import { UnderlineColor } from './extensions/underline-color'
import { Callout } from './extensions/callout'
import { Expandable } from './extensions/expandable'
import { PageBreak } from './extensions/page-break'
import { useEditorStore } from './editor.store'
import { editorWrapper } from './editor.styles.css'
import type { EditorProps } from './editor.types'
import EditorBubbleMenu from './editor-bubble-menu'
import EditorContent from './editor-content'
import EditorStatusBar from './editor-status-bar'
import EditorToolbar from './editor-toolbar'

const lowlight = createLowlight(common)

export default function Editor({
	placeholder = 'Escribe algo...',
	characterLimit,
	editable = true,
	size = 'md',
	className,
	exportFilename,
	onUpdate,
	onBlur,
	onFocus,
	autofocus = false,
}: EditorProps) {
	const setEditor = useEditorStore((s) => s.setEditor)

	const extensions: any[] = [
		StarterKit.configure({ codeBlock: false }),
		Placeholder.configure({ placeholder }),
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
		...(characterLimit
			? [CharacterCount.configure({ limit: characterLimit })]
			: []),
	]

	const editor = useEditor({
		extensions,
		editable,
		autofocus,
		onUpdate: ({ editor: ed }) => {
			onUpdate?.(ed)
		},
		onBlur: ({ editor: ed }) => {
			onBlur?.(ed)
		},
		onFocus: ({ editor: ed }) => {
			onFocus?.(ed)
		},
	})

	useEffect(() => {
		setEditor(editor)
		return () => setEditor(null)
	}, [editor, setEditor])

	if (!editor) return null

	return (
		<div className={`${editorWrapper} ${className ?? ''}`}>
			{editable && <EditorToolbar editor={editor} filename={exportFilename} />}
			{editable && <EditorBubbleMenu editor={editor} />}
			<EditorContent editor={editor} size={size} />
			{editable && (
				<EditorStatusBar editor={editor} characterLimit={characterLimit} />
			)}
		</div>
	)
}
