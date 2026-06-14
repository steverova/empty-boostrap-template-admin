import { Node, mergeAttributes } from '@tiptap/core'

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		pageBreak: {
			setPageBreak: () => ReturnType
		}
	}
}

export const PageBreak = Node.create({
	name: 'pageBreak',
	group: 'block',
	draggable: true,
	selectable: false,

	parseHTML() {
		return [{ tag: 'div[data-page-break]' }]
	},

	renderHTML({ HTMLAttributes }) {
		return [
			'div',
			mergeAttributes(HTMLAttributes, {
				'data-page-break': '',
				class: 'editor-page-break',
				contenteditable: 'false',
			}),
			['div', { style: 'border-top: 2px dashed var(--bs-secondary-color); margin: 16px 0; position: relative;' },
				['span', {
					style: 'position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: var(--bs-body-bg); padding: 0 8px; font-size: 11px; color: var(--bs-secondary-color); white-space: nowrap;',
				}, 'Salto de página'],
			],
		]
	},

	addCommands() {
		return {
			setPageBreak:
				() =>
				({ commands }) => {
					return commands.insertContent({
						type: this.name,
					})
				},
		}
	},

	addKeyboardShortcuts() {
		return {}
	},
})
