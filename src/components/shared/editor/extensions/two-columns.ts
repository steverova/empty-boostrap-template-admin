import { Node, mergeAttributes } from '@tiptap/core'

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		twoColumns: {
			setTwoColumns: () => ReturnType
			toggleTwoColumns: () => ReturnType
			unsetTwoColumns: () => ReturnType
		}
	}
}

export const TwoColumns = Node.create({
	name: 'twoColumns',

	group: 'block',

	content: 'columnBlock columnBlock',

	parseHTML() {
		return [{ tag: 'div[data-two-columns]' }]
	},

	renderHTML({ HTMLAttributes }) {
		return [
			'div',
			mergeAttributes(HTMLAttributes, {
				'data-two-columns': '',
				class: 'editor-two-columns',
			}),
			0,
		]
	},

	addCommands() {
		return {
			setTwoColumns:
				() =>
				({ commands, state }) => {
					const { $from } = state.selection
					if ($from.parent.type.name === 'twoColumns') {
						return false
					}
					return commands.wrapIn(this.name)
				},
			toggleTwoColumns:
				() =>
				({ commands, state }) => {
					const { $from } = state.selection
					if ($from.parent.type.name === 'twoColumns') {
						return commands.lift(this.name)
					}
					return commands.wrapIn(this.name)
				},
			unsetTwoColumns:
				() =>
				({ commands }) => {
					return commands.lift(this.name)
				},
		}
	},

	addKeyboardShortcuts() {
		return {
			'Mod-Shift-2': () => this.editor.commands.toggleTwoColumns(),
		}
	},
})

export const ColumnBlock = Node.create({
	name: 'columnBlock',

	group: 'columnBlock',

	content: 'block+',

	parseHTML() {
		return [{ tag: 'div[data-column-block]' }]
	},

	renderHTML({ HTMLAttributes }) {
		return [
			'div',
			mergeAttributes(HTMLAttributes, {
				'data-column-block': '',
				class: 'editor-column-block',
			}),
			0,
		]
	},
})
