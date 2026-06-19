import { InputRule } from '@tiptap/core'
import type { NodeViewProps } from '@tiptap/react'
import {
	mergeAttributes,
	Node,
	NodeViewWrapper,
	ReactNodeViewRenderer,
} from '@tiptap/react'
import { useCallback, useRef, useState } from 'react'

const ALIGN_ICONS = {
	left: (
		<svg
			width='16'
			height='16'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
		>
			<line x1='3' y1='6' x2='21' y2='6' />
			<line x1='3' y1='12' x2='15' y2='12' />
			<line x1='3' y1='18' x2='18' y2='18' />
		</svg>
	),
	center: (
		<svg
			width='16'
			height='16'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
		>
			<line x1='3' y1='6' x2='21' y2='6' />
			<line x1='6' y1='12' x2='18' y2='12' />
			<line x1='4' y1='18' x2='20' y2='18' />
		</svg>
	),
	right: (
		<svg
			width='16'
			height='16'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
		>
			<line x1='3' y1='6' x2='21' y2='6' />
			<line x1='9' y1='12' x2='21' y2='12' />
			<line x1='6' y1='18' x2='21' y2='18' />
		</svg>
	),
} as const

function YouTubePlayer({ node, updateAttributes }: NodeViewProps) {
	const { src } = node.attrs
	const width = (node.attrs.width as number) || 100
	const align = (node.attrs.align as string) || 'center'
	const wrapperRef = useRef<HTMLDivElement>(null)
	const [hovered, setHovered] = useState(false)
	const [isDragging, setIsDragging] = useState(false)
	const dragging = useRef(false)
	const startX = useRef(0)
	const startWidth = useRef(0)

	const handleMouseDown = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault()
			e.stopPropagation()
			dragging.current = true
			setIsDragging(true)
			startX.current = e.clientX
			startWidth.current =
				wrapperRef.current?.getBoundingClientRect().width ?? 0

			const onMouseMove = (ev: MouseEvent) => {
				if (!dragging.current) return
				const dx = ev.clientX - startX.current
				const editorWidth =
					wrapperRef.current?.parentElement?.getBoundingClientRect().width ??
					600
				const newWidthPx = Math.max(
					80,
					Math.min(editorWidth, startWidth.current + dx),
				)
				const newWidthPct = Math.round((newWidthPx / editorWidth) * 100)
				updateAttributes({ width: newWidthPct })
			}

			const onMouseUp = () => {
				dragging.current = false
				setIsDragging(false)
				document.removeEventListener('mousemove', onMouseMove)
				document.removeEventListener('mouseup', onMouseUp)
			}

			document.addEventListener('mousemove', onMouseMove)
			document.addEventListener('mouseup', onMouseUp)
		},
		[updateAttributes],
	)

	const handleAlign = (newAlign: string) => {
		updateAttributes({ align: newAlign })
	}

	const getContainerStyle = (): React.CSSProperties => {
		const base: React.CSSProperties = {
			position: 'relative',
			width: `${width}%`,
			maxWidth: '100%',
			margin: '8px 0',
			borderRadius: 'var(--bs-border-radius)',
			border: hovered ? '2px solid var(--bs-primary)' : '2px solid transparent',
			transition: 'border-color 0.15s ease',
		}
		if (align === 'center') {
			base.marginLeft = 'auto'
			base.marginRight = 'auto'
		} else if (align === 'right') {
			base.marginLeft = 'auto'
		}
		return base
	}

	return (
		<NodeViewWrapper>
			<div
				ref={wrapperRef}
				onMouseEnter={() => setHovered(true)}
				onMouseLeave={() => setHovered(false)}
				style={getContainerStyle()}
			>
				{hovered && (
					<div
						style={{
							position: 'absolute',
							top: -32,
							left: '50%',
							transform: 'translateX(-50%)',
							display: 'flex',
							gap: 2,
							zIndex: 20,
							backgroundColor: 'var(--bs-body-bg)',
							border: '1px solid var(--bs-border-color)',
							borderRadius: 4,
							padding: '2px 4px',
							boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
						}}
					>
						{(['left', 'center', 'right'] as const).map((a) => (
							<button
								key={a}
								type='button'
								onClick={(e) => {
									e.preventDefault()
									e.stopPropagation()
									handleAlign(a)
								}}
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									width: 24,
									height: 24,
									padding: 0,
									border: 'none',
									borderRadius: 3,
									backgroundColor:
										align === a ? 'var(--bs-primary)' : 'transparent',
									color:
										align === a
											? 'var(--bs-primary-text)'
											: 'var(--bs-secondary-color)',
									cursor: 'pointer',
									transition: 'background-color 0.1s ease',
								}}
								title={`Alinear a la ${a === 'left' ? 'izquierda' : a === 'center' ? 'centro' : 'derecha'}`}
							>
								{ALIGN_ICONS[a]}
							</button>
						))}
					</div>
				)}
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
							pointerEvents: isDragging ? 'none' : 'auto',
						}}
						allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
						allowFullScreen
						title='YouTube video'
					/>
				</div>
				{hovered && (
					<div
						style={{
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
						}}
						onMouseDown={handleMouseDown}
						title='Arrastrar para redimensionar'
					>
						<div
							style={{
								width: 8,
								height: 8,
								backgroundColor: 'var(--bs-primary)',
								borderRadius: '50%',
							}}
						/>
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
			align: {
				default: 'center',
				parseHTML: (element: HTMLElement) => {
					const style = element.getAttribute('style') ?? ''
					if (
						style.includes('margin-left: auto') &&
						style.includes('margin-right: auto')
					)
						return 'center'
					if (style.includes('margin-left: auto')) return 'right'
					return 'left'
				},
				renderHTML: (attributes: Record<string, any>) => {
					const a = attributes.align as string
					if (a === 'center')
						return { style: 'margin-left: auto; margin-right: auto;' }
					if (a === 'right') return { style: 'margin-left: auto;' }
					return {}
				},
			},
		}
	},

	parseHTML() {
		return [{ tag: 'div[data-youtube]' }]
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
