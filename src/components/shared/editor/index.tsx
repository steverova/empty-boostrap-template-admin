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
import { common, createLowlight } from 'lowlight'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import ImageResize from 'tiptap-extension-resize-image'
import { useEditorStore } from './editor.store'
import { editorWrapper } from './editor.styles.css'
import type { EditorProps } from './editor.types'
import EditorBubbleMenu from './editor-bubble-menu'
import EditorContent from './editor-content'
import EditorStatusBar from './editor-status-bar'
import EditorToolbar from './editor-toolbar'
import { Callout } from './extensions/callout'
import { Expandable } from './extensions/expandable'
import { FontSize } from './extensions/font-size'
import { Indent } from './extensions/indent'
import { PageBreak } from './extensions/page-break'
import { ColumnBlock, TwoColumns } from './extensions/two-columns'
import { UnderlineColor } from './extensions/underline-color'
import { YouTube } from './extensions/youtube'

export type { EditorProps } from './editor.types'

const lowlight = createLowlight(common)

export default function Editor({
	placeholder = 'Escribe algo...',
	characterLimit,
	editable = true,
	size = 'md',
	className,
	exportFilename,
	initialContent,
	onUpdate,
	onBlur,
	onFocus,
	autofocus = false,
	stickyToolbar = true,
}: EditorProps): ReactNode {
	const setEditor = useEditorStore((s) => s.setEditor)
	const currentWidth = useEditorStore((s) => s.containerWidth)
	const [isFullscreen, setIsFullscreen] = useState(false)

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
		...(characterLimit && characterLimit > 0
			? [CharacterCount.configure({ limit: characterLimit })]
			: []),
	]

	const editor = useEditor({
		extensions,
		editable,
		autofocus,
		content: initialContent || '',
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

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === 'Escape' && isFullscreen) {
				setIsFullscreen(false)
			}
			if (e.key === 'F11') {
				e.preventDefault()
				setIsFullscreen((prev) => !prev)
			}
		}
		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [isFullscreen])

	if (!editor) return null

	return (
		<div className={`${editorWrapper} ${className ?? ''} ${isFullscreen ? 'editor-fullscreen' : ''}`}>
			{editable && (
				<EditorToolbar
					editor={editor}
					filename={exportFilename}
					sticky={stickyToolbar}
					isFullscreen={isFullscreen}
					onToggleFullscreen={() => setIsFullscreen((prev) => !prev)}
				/>
			)}
			{editable && <EditorBubbleMenu editor={editor} />}
			<EditorContent editor={editor} size={size} width={currentWidth} />
			{editable && (
				<EditorStatusBar editor={editor} characterLimit={characterLimit} />
			)}
		</div>
	)
}
