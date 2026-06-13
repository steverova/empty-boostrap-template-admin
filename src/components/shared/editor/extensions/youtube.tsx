import { InputRule } from '@tiptap/core'
import { mergeAttributes, Node, ReactNodeViewRenderer } from '@tiptap/react'
import type { NodeViewProps } from '@tiptap/react'
import { NodeViewWrapper } from '@tiptap/react'

function YouTubePlayer({ node }: NodeViewProps) {
	const { src } = node.attrs

	return (
		<NodeViewWrapper>
			<div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 'var(--bs-border-radius)', margin: '8px 0' }}>
				<iframe
					src={src}
					style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
					allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
					allowFullScreen
					title='YouTube video'
				/>
			</div>
		</NodeViewWrapper>
	)
}

function extractYouTubeId(url: string): string | null {
	const patterns = [
		/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
	]
	for (const pattern of patterns) {
		const match = url.match(pattern)
		if (match) return match[1]
	}
	return null
}

export const YouTube = Node.create({
	name: 'youtube',
	group: 'block',
	draggable: true,

	addAttributes() {
		return {
			src: {
				default: null,
				parseHTML: (element: HTMLElement) => element.getAttribute('src'),
				renderHTML: (attributes: Record<string, any>) => ({ src: attributes.src }),
			},
		}
	},

	parseHTML() {
		return [
			{
				tag: 'div[data-youtube]',
			},
		]
	},

	renderHTML({ HTMLAttributes }) {
		return ['div', mergeAttributes(HTMLAttributes, { 'data-youtube': '' })]
	},

	addNodeView() {
		return ReactNodeViewRenderer(YouTubePlayer)
	},

	addCommands() {
		return {} as any
	},

	addInputRules() {
		return [
			new InputRule({
				find: /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})\S*\s$/,
				handler: ({ state, range, match }: { state: any; range: any; match: any }) => {
					const id = match[1]
					const src = `https://www.youtube.com/embed/${id}`
					const { tr } = state
					tr.replaceWith(range.from, range.to, (this as any).type.create({ src }))
				},
			}),
		]
	},
})

export { extractYouTubeId }
