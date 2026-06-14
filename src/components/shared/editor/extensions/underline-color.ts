import { Mark, mergeAttributes } from '@tiptap/core'

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		underlineColor: {
			setUnderlineColor: (color: string) => ReturnType
			toggleUnderlineColor: (color: string) => ReturnType
			unsetUnderlineColor: () => ReturnType
		}
	}
}

export const UnderlineColor = Mark.create({
	name: 'underlineColor',

	addOptions() {
		return {
			types: ['textStyle'],
		}
	},

	addAttributes() {
		return {
			underlineColor: {
				default: null,
				parseHTML: (element: HTMLElement) =>
					element.style.textDecorationColor || null,
				renderHTML: (attributes) => {
					if (!attributes.underlineColor) return {}
					return {
						style: `text-decoration: underline; text-decoration-color: ${attributes.underlineColor}; text-underline-offset: 2px;`,
					}
				},
			},
		}
	},

	parseHTML() {
		return [
			{
				tag: 'span[style*="text-decoration-color"]',
				getAttrs: (element) => {
					const style = (element as HTMLElement).style
					if (style.textDecoration.includes('underline') && style.textDecorationColor) {
						return { underlineColor: style.textDecorationColor }
					}
					return false
				},
			},
		]
	},

	renderHTML({ HTMLAttributes }) {
		return ['span', mergeAttributes(HTMLAttributes), 0]
	},

	addCommands() {
		return {
			setUnderlineColor:
				(color: string) =>
				({ commands }) => {
					return commands.setMark(this.name, { underlineColor: color })
				},
			toggleUnderlineColor:
				(color: string) =>
				({ commands }) => {
					return commands.toggleMark(this.name, { underlineColor: color })
				},
			unsetUnderlineColor:
				() =>
				({ commands }) => {
					return commands.unsetMark(this.name)
				},
		}
	},

	addKeyboardShortcuts() {
		return {}
	},
})
