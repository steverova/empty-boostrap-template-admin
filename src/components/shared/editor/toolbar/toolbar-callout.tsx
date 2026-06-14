import AppTooltip from '@components/shared/tooltip'
import type { Editor } from '@tiptap/react'
import { Info, AlertTriangle, CheckCircle, XCircle, Lightbulb } from 'lucide-react'
import { useState } from 'react'
import Overlay from 'react-bootstrap/Overlay'
import Popover from 'react-bootstrap/Popover'
import { toolbarButton } from '../editor.styles.css'

const CALLOUT_TYPES = [
	{ type: 'info' as const, icon: Info, label: 'Info', color: '#0dcaf0' },
	{ type: 'warning' as const, icon: AlertTriangle, label: 'Advertencia', color: '#ffc107' },
	{ type: 'success' as const, icon: CheckCircle, label: 'Éxito', color: '#198754' },
	{ type: 'danger' as const, icon: XCircle, label: 'Peligro', color: '#dc3545' },
	{ type: 'tip' as const, icon: Lightbulb, label: 'Consejo', color: '#6f42c1' },
]

type ToolbarCalloutProps = {
	editor: Editor
}

export default function ToolbarCallout({ editor }: ToolbarCalloutProps) {
	const [show, setShow] = useState(false)
	const [target, setTarget] = useState<HTMLElement | null>(null)

	const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
		setTarget(e.currentTarget)
		setShow(!show)
	}

	const handleSelect = (type: string) => {
		editor.chain().focus().setCallout(type).run()
		setShow(false)
	}

	return (
		<>
			<AppTooltip label='Callout / Advertencia' placement='top'>
				<button
					type='button'
					className={toolbarButton}
					aria-label='Callout / Advertencia'
					onClick={handleToggle}
				>
					<Info size={16} strokeWidth={2} />
				</button>
			</AppTooltip>
			<Overlay
				show={show}
				target={target}
				placement='bottom'
				rootClose
				onHide={() => setShow(false)}
			>
				<Popover onMouseDown={(e: React.MouseEvent) => e.preventDefault()}>
					<Popover.Body>
						<div style={{ display: 'flex', gap: 4, padding: 4 }}>
							{CALLOUT_TYPES.map((c) => {
								const Icon = c.icon
								return (
									<button
										key={c.type}
										type='button'
										style={{
											display: 'flex',
											flexDirection: 'column',
											alignItems: 'center',
											gap: 2,
											padding: '6px 8px',
											border: '1px solid var(--bs-border-color)',
											borderRadius: 'var(--bs-border-radius)',
											background: 'var(--bs-body-bg)',
											cursor: 'pointer',
											fontSize: 11,
										}}
										onClick={() => handleSelect(c.type)}
									>
										<Icon size={18} style={{ color: c.color }} />
										<span>{c.label}</span>
									</button>
								)
							})}
						</div>
					</Popover.Body>
				</Popover>
			</Overlay>
		</>
	)
}
