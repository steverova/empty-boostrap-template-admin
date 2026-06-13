import { InputRule } from '@tiptap/core'
import { mergeAttributes, Node, ReactNodeViewRenderer } from '@tiptap/react'
import type { NodeViewProps } from '@tiptap/react'
import { NodeViewWrapper } from '@tiptap/react'
import { useCallback, useRef, useState } from 'react'

const RESIZE_HANDLE_STYLE: React.CSSProperties = {
	position: 'absolute',
	bottom: 0,
	right: 0,
	width: 20,
	height: 20,
	cursor: 'nwse-resize',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	zIndex: 10,
}

const RESIZE_DOT_STYLE: React.CSSProperties = {
	width: 8,
	height: 8,
	backgroundColor: 'var(--bs-primary)',
	borderRadius: '50%',
}

function YouTubePlayer({ node, updateAttributes }: NodeViewProps) {
	const { src } = node.attrs
	const width = (node.attrs.width as number) || 100
	const wrapperRef = useRef<HTMLDivElement>(null)
	const [hovered, setHovered] = useState(false)
	const dragging = useRef(false)
	const startX = useRef(0)
	const startWidth = useRef(0)

	const handleMouseDown = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault()
			e.stopPropagation()
			dragging.current = true
			startX.current = e.clientX
			startWidth.current = wrapperRef.current?.getBoundingClientRect().width ?? 0

			const onMouseMove = (ev: MouseEvent) => {
				if (!dragging.current) return
				const dx = ev.clientX - startX.current
				const editorWidth =
					wrapperRef.current?.parentElement?.getBoundingClientRect().width ?? 600
				const newWidthPx = Math.max(80, Math.min(editorWidth, startWidth.current + dx))
				const newWidthPct = Math.round((newWidthPx / editorWidth) * 100)
				updateAttributes({ width: newWidthPct })
			}

			const onMouseUp = () => {
				dragging.current = false
				document.removeEventListener('mousemove', onMouseMove)
				document.removeEventListener('mouseup', onMouseUp)
			}

			document.addEventListener('mousemove', onMouseMove)
			document.addEventListener('mouseup', onMouseUp)
		},
		[updateAttributes],
	)

	return (
		<NodeViewWrapper>
			<div
				ref={wrapperRef}
				onMouseEnter={() => setHovered(true)}
				onMouseLeave={() => setHovered(false)}
				style={{
					position: 'relative',
					width: `${width}%`,
					maxWidth: '100%',
					margin: '8px 0',
					borderRadius: 'var(--bs-border-radius)',
					border: hovered ? '2px solid var(--bs-primary)' : '2px solid transparent',
					transition: 'border-color 0.15s ease',
				}}
			>
				<div
					style={{
						position: 'relative',
						paddingBottom: '56.25%',
						height: 0,
						overflow: 'hidden',
						borderRadius: 'var(--bs-border-radius)',
					}}
				>
					<iframe
						src={src}
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							height: '100%',
							border: 0,
							pointerEvents: dragging.current ? 'none' : 'auto',
						}}
						allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
						allowFullScreen
						title='YouTube video'
					/>
				</div>
				{hovered && (
					<div
						style={RESIZE_HANDLE_STYLE}
						onMouseDown={handleMouseDown}
						title='Arrastrar para redimensionar'
					>
						<div style={RESIZE_DOT_STYLE} />
					</div>
				)}
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
				renderHTML: (attributes: Record<string, any>) => ({
					src: attributes.src,
				}),
			},
			width: {
				default: 100,
				parseHTML: (element: HTMLElement) => {
					const style = element.getAttribute('style') ?? ''
					const match = style.match(/width:\s*(\d+)%/)
					return match ? Number.parseInt(match[1]) : 100
				},
				renderHTML: (attributes: Record<string, any>) => {
					const w = attributes.width as number
					if (w && w < 100) return { style: `width: ${w}%` }
					return {}
				},
			},
		}
	},

	parseHTML() {
		return [{ tag: 'div[data-youtube]' }]
	},

	renderHTML({ HTMLAttributes }) {
		return [
			'div',
			mergeAttributes(HTMLAttributes, { 'data-youtube': '' }),
		]
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
				handler: ({
					state,
					range,
					match,
				}: {
					state: any
					range: any
					match: any
				}) => {
					const id = match[1]
					const src = `https://www.youtube.com/embed/${id}`
					const { tr } = state
					tr.replaceWith(
						range.from,
						range.to,
						(this as any).type.create({ src }),
					)
				},
			}),
		]
	},
})

export { extractYouTubeId }
