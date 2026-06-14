import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewContent } from '@tiptap/react'
import type { NodeViewProps } from '@tiptap/react'
import { NodeViewWrapper } from '@tiptap/react'
import { useState } from 'react'

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		expandable: {
			setExpandable: () => ReturnType
			toggleExpandable: () => ReturnType
		}
	}
}

function ExpandableComponent({ node, updateAttributes }: NodeViewProps) {
	const title = (node.attrs.title as string) || 'Clic para expandir'
	const [open, setOpen] = useState(false)

	return (
		<NodeViewWrapper>
			<div
				style={{
					margin: '8px 0',
					border: '1px solid var(--bs-border-color)',
					borderRadius: 'var(--bs-border-radius)',
					overflow: 'hidden',
				}}
			>
				<div
					onClick={() => setOpen(!open)}
					contentEditable={false}
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 8,
						padding: '8px 12px',
						backgroundColor: 'var(--bs-tertiary-bg)',
						cursor: 'pointer',
						userSelect: 'none',
						fontWeight: 600,
						fontSize: '0.9em',
					}}
				>
					<span
						style={{
							transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
							transition: 'transform 0.2s ease',
							fontSize: 10,
							color: 'var(--bs-secondary-color)',
						}}
					>
						▶
					</span>
					<input
						value={title}
						onChange={(e) => updateAttributes({ title: e.target.value })}
						onClick={(e) => e.stopPropagation()}
						style={{
							border: 'none',
							background: 'transparent',
							outline: 'none',
							fontWeight: 600,
							fontSize: '0.9em',
							flex: 1,
							padding: 0,
						}}
					/>
				</div>
				<NodeViewContent
					style={{
						padding: open ? '8px 12px' : 0,
						borderTop: open ? '1px solid var(--bs-border-color)' : 'none',
						display: open ? 'block' : 'none',
					}}
				/>
			</div>
		</NodeViewWrapper>
	)
}

export const Expandable = Node.create({
	name: 'expandable',
	group: 'block',
	content: 'block+',

	addAttributes() {
		return {
			title: {
				default: 'Clic para expandir',
				parseHTML: (element: HTMLElement) =>
					element.getAttribute('data-expandable-title') || 'Clic para expandir',
				renderHTML: (attributes) => ({
					'data-expandable-title': attributes.title,
				}),
			},
		}
	},

	parseHTML() {
		return [{ tag: 'div[data-expandable]' }]
	},

	renderHTML({ HTMLAttributes }) {
		return [
			'div',
			mergeAttributes(HTMLAttributes, {
				'data-expandable': '',
				class: 'editor-expandable',
			}),
			0,
		]
	},

	addNodeView() {
		return ReactNodeViewRenderer(ExpandableComponent)
	},

	addCommands() {
		return {
			setExpandable:
				() =>
				({ commands }: { commands: any }) => {
					return commands.wrapIn(this.name)
				},
			toggleExpandable:
				() =>
				({ commands }: { commands: any }) => {
					return commands.toggleWrap(this.name)
				},
		}
	},
})
