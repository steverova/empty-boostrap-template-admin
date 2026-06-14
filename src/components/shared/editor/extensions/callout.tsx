import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewContent } from '@tiptap/react'
import type { NodeViewProps } from '@tiptap/react'
import { NodeViewWrapper } from '@tiptap/react'
import { useState } from 'react'

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		callout: {
			setCallout: (type?: string) => ReturnType
			toggleCallout: (type?: string) => ReturnType
		}
	}
}

const CALLOUT_TYPES = {
	info: { icon: 'ℹ️', label: 'Info', color: '#0dcaf0', bg: '#cff4fc' },
	warning: { icon: '⚠️', label: 'Advertencia', color: '#ffc107', bg: '#fff3cd' },
	success: { icon: '✅', label: 'Éxito', color: '#198754', bg: '#d1e7dd' },
	danger: { icon: '❌', label: 'Peligro', color: '#dc3545', bg: '#f8d7da' },
	tip: { icon: '💡', label: 'Consejo', color: '#6f42c1', bg: '#e2d9f3' },
} as const

type CalloutType = keyof typeof CALLOUT_TYPES

function CalloutComponent({ node, updateAttributes }: NodeViewProps) {
	const calloutType = (node.attrs.calloutType as CalloutType) || 'info'
	const config = CALLOUT_TYPES[calloutType]
	const [showPicker, setShowPicker] = useState(false)

	return (
		<NodeViewWrapper>
			<div
				style={{
					display: 'flex',
					gap: 12,
					padding: '12px 16px',
					margin: '8px 0',
					borderRadius: 'var(--bs-border-radius)',
					borderLeft: `4px solid ${config.color}`,
					backgroundColor: config.bg,
					position: 'relative',
				}}
			>
				<div
					style={{
						fontSize: 20,
						lineHeight: 1,
						cursor: 'pointer',
						flexShrink: 0,
						userSelect: 'none',
					}}
					onClick={() => setShowPicker(!showPicker)}
					title='Cambiar tipo de callout'
				>
					{config.icon}
				</div>
				{showPicker && (
					<div
						style={{
							position: 'absolute',
							top: -8,
							left: 0,
							display: 'flex',
							gap: 4,
							zIndex: 20,
							backgroundColor: 'var(--bs-body-bg)',
							border: '1px solid var(--bs-border-color)',
							borderRadius: 4,
							padding: '4px 6px',
							boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
						}}
					>
						{(Object.keys(CALLOUT_TYPES) as CalloutType[]).map((type) => (
							<button
								key={type}
								type='button'
								onClick={() => {
									updateAttributes({ calloutType: type })
									setShowPicker(false)
								}}
								style={{
									fontSize: 18,
									cursor: 'pointer',
									background: type === calloutType ? CALLOUT_TYPES[type].bg : 'transparent',
									border: type === calloutType ? `2px solid ${CALLOUT_TYPES[type].color}` : '2px solid transparent',
									borderRadius: 4,
									padding: 2,
									lineHeight: 1,
								}}
								title={CALLOUT_TYPES[type].label}
							>
								{CALLOUT_TYPES[type].icon}
							</button>
						))}
					</div>
				)}
				<NodeViewContent style={{ flex: 1, minWidth: 0 }} />
			</div>
		</NodeViewWrapper>
	)
}

export const Callout = Node.create({
	name: 'callout',
	group: 'block',
	content: 'block+',

	addAttributes() {
		return {
			calloutType: {
				default: 'info',
				parseHTML: (element: HTMLElement) =>
					element.getAttribute('data-callout-type') || 'info',
				renderHTML: (attributes) => ({
					'data-callout-type': attributes.calloutType,
				}),
			},
		}
	},

	parseHTML() {
		return [{ tag: 'div[data-callout]' }]
	},

	renderHTML({ HTMLAttributes }) {
		return [
			'div',
			mergeAttributes(HTMLAttributes, {
				'data-callout': '',
				class: 'editor-callout',
			}),
			0,
		]
	},

	addNodeView() {
		return ReactNodeViewRenderer(CalloutComponent)
	},

	addCommands() {
		return {
			setCallout:
				(type: string = 'info') =>
				({ commands }: { commands: any }) => {
					return commands.wrapIn(this.name, { calloutType: type })
				},
			toggleCallout:
				(type: string = 'info') =>
				({ commands }: { commands: any }) => {
					return commands.toggleWrap(this.name, { calloutType: type })
				},
		}
	},
})
