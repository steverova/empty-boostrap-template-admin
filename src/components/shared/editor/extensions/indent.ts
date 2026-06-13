import { Extension } from '@tiptap/core'

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		indent: {
			indent: () => ReturnType
			outdent: () => ReturnType
		}
	}
}

export const Indent = Extension.create({
	name: 'indent',

	addOptions() {
		return {
			levels: [0, 1, 2, 3, 4, 5, 6, 7, 8],
			defaultLevel: 0,
		}
	},

	addGlobalAttributes() {
		return [
			{
				types: ['paragraph', 'heading'],
				attributes: {
					indent: {
						default: 0,
						parseHTML: (element) => {
							const marginLeft = element.style.marginLeft
							if (!marginLeft) return 0
							const px = Number.parseInt(marginLeft)
							return Math.round(px / 40)
						},
						renderHTML: (attributes) => {
							const level = attributes.indent as number
							if (!level || level <= 0) return {}
							return { style: `margin-left: ${level * 40}px` }
						},
					},
				},
			},
		]
	},

	addCommands() {
		return {
			indent:
				() =>
				({ tr, dispatch }) => {
					const { selection } = tr
					const pos = selection.$from
					const depth = pos.depth === 0 ? 1 : pos.depth
					const node = pos.node(depth)
					if (!node) return false
					const currentIndent = (node.attrs.indent as number) || 0
					const maxLevel = Math.max(...(this.options.levels as number[]))
					if (currentIndent >= maxLevel) return false
					if (dispatch) {
						tr.setNodeMarkup(pos.before(depth), undefined, {
							...node.attrs,
							indent: currentIndent + 1,
						})
						dispatch(tr)
					}
					return true
				},
			outdent:
				() =>
				({ tr, dispatch }) => {
					const { selection } = tr
					const pos = selection.$from
					const depth = pos.depth === 0 ? 1 : pos.depth
					const node = pos.node(depth)
					if (!node) return false
					const currentIndent = (node.attrs.indent as number) || 0
					if (currentIndent <= 0) return false
					if (dispatch) {
						tr.setNodeMarkup(pos.before(depth), undefined, {
							...node.attrs,
							indent: currentIndent - 1,
						})
						dispatch(tr)
					}
					return true
				},
		}
	},

	addKeyboardShortcuts() {
		return {
			Tab: () => this.editor.commands.indent(),
			'Shift-Tab': () => this.editor.commands.outdent(),
		}
	},
})
