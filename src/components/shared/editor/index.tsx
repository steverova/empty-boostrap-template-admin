import CharacterCount from '@tiptap/extension-character-count'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { Table } from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import Typography from '@tiptap/extension-typography'
import Underline from '@tiptap/extension-underline'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { common, createLowlight } from 'lowlight'
import { useEffect } from 'react'
import { YouTube } from './extensions/youtube'
import { useEditorStore } from './editor.store'
import { editorWrapper } from './editor.styles.css'
import type { EditorProps } from './editor.types'
import EditorBubbleMenu from './editor-bubble-menu'
import EditorContent from './editor-content'
import EditorExportMenu from './editor-export-menu'
import EditorStatusBar from './editor-status-bar'
import EditorToolbar from './editor-toolbar'

const lowlight = createLowlight(common)

export default function Editor({
	placeholder = 'Escribe algo...',
	characterLimit,
	editable = true,
	size = 'md',
	className,
	showExport = false,
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
		Highlight,
		Underline,
		TextStyle,
		Color,
		TextAlign.configure({ types: ['heading', 'paragraph'] }),
		Link.configure({ openOnClick: false, autolink: true }),
		Image.configure({ inline: true }),
		Table.configure({ resizable: true }),
		TableRow,
		TableCell,
		TableHeader,
		Typography,
		TaskList,
		TaskItem.configure({ nested: true }),
		CodeBlockLowlight.configure({ lowlight }),
		YouTube,
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
			{editable && (
				<div className='d-flex justify-content-end px-2 pt-2'>
					{showExport && <EditorExportMenu editor={editor} filename={exportFilename} />}
				</div>
			)}
			{editable && <EditorToolbar editor={editor} />}
			{editable && <EditorBubbleMenu editor={editor} />}
			<EditorContent editor={editor} size={size} />
			{editable && (
				<EditorStatusBar editor={editor} characterLimit={characterLimit} />
			)}
		</div>
	)
}
