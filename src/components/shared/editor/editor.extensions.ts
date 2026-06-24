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
import StarterKit from '@tiptap/starter-kit'
import { common, createLowlight } from 'lowlight'
import ImageResize from 'tiptap-extension-resize-image'
import { Callout } from './extensions/callout'
import { Expandable } from './extensions/expandable'
import { FontSize } from './extensions/font-size'
import { Indent } from './extensions/indent'
import { PageBreak } from './extensions/page-break'
import { ColumnBlock, TwoColumns } from './extensions/two-columns'
import { UnderlineColor } from './extensions/underline-color'

const lowlight = createLowlight(common)

type GetExtensionsConfig = {
	placeholder?: string
	characterLimit?: number
}

export function getExtensions({
	placeholder = 'Escribe algo...',
	characterLimit,
}: GetExtensionsConfig = {}) {
	const extensions: any[] = [
		StarterKit.configure({
			codeBlock: false,
		}),
		Placeholder.configure({
			placeholder,
		}),
		Highlight,
		Underline,
		UnderlineColor,
		FontSize,
		Indent,
		Color,
		TextAlign.configure({
			types: ['heading', 'paragraph'],
		}),
		Link.configure({
			openOnClick: false,
			autolink: true,
		}),
		ImageResize,
		Table.configure({
			resizable: true,
		}),
		TableRow,
		TableCell,
		TableHeader,
		Typography,
		TaskList,
		TaskItem.configure({
			nested: true,
		}),
		CodeBlockLowlight.configure({
			lowlight,
		}),
		TwoColumns,
		ColumnBlock,
		Callout,
		Expandable,
		PageBreak,
	]

	if (characterLimit) {
		const CharacterCountExt = CharacterCount.configure({
			limit: characterLimit,
		})
		extensions.push(CharacterCountExt)
	}

	return extensions
}
