import { TextStyle } from '@tiptap/extension-text-style'

export const FontSize = TextStyle.extend({
	addAttributes() {
		return {
			fontSize: {
				default: null,
				parseHTML: (element: HTMLElement) =>
					element.style.fontSize?.replace(/['"]+/g, '') || null,
				renderHTML: (attributes: Record<string, unknown>) => {
					if (!attributes.fontSize) return {}
					return { style: `font-size: ${attributes.fontSize}` }
				},
			},
			fontFamily: {
				default: null,
				parseHTML: (element: HTMLElement) =>
					element.style.fontFamily?.replace(/['"]+/g, '') || null,
				renderHTML: (attributes: Record<string, unknown>) => {
					if (!attributes.fontFamily) return {}
					return { style: `font-family: ${attributes.fontFamily}` }
				},
			},
		}
	},
})
