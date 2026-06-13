import type { Editor } from '@tiptap/react'

export type EditorSize = 'sm' | 'md' | 'lg'

export type EditorToolbarGroup =
	| 'text-style'
	| 'heading'
	| 'list'
	| 'alignment'
	| 'insert'
	| 'history'
	| 'table'

export type ToolbarButtonConfig = {
	icon: React.ComponentType<{ size?: number; strokeWidth?: number }>
	label: string
	action: (editor: Editor) => void
	isActive?: (editor: Editor) => boolean
	disabled?: (editor: Editor) => boolean
	tooltip: string
}

export type EditorProps = {
	placeholder?: string
	characterLimit?: number
	editable?: boolean
	size?: EditorSize
	className?: string
	showExport?: boolean
	exportFilename?: string
	onUpdate?: (editor: Editor) => void
	onBlur?: (editor: Editor) => void
	onFocus?: (editor: Editor) => void
	autofocus?: boolean
}

export type EditorState = {
	editor: Editor | null
	setEditor: (editor: Editor | null) => void
}
