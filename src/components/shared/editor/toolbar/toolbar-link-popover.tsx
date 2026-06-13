import AppTooltip from '@components/shared/tooltip'
import type { Editor } from '@tiptap/react'
import { Link2, Unlink } from 'lucide-react'
import { useCallback, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Overlay from 'react-bootstrap/Overlay'
import Popover from 'react-bootstrap/Popover'
import { toolbarButton } from '../editor.styles.css'

type ToolbarLinkPopoverProps = {
	editor: Editor
}

export default function ToolbarLinkPopover({
	editor,
}: ToolbarLinkPopoverProps) {
	const [show, setShow] = useState(false)
	const [target, setTarget] = useState<HTMLElement | null>(null)
	const [url, setUrl] = useState('')

	const isLink = editor.isActive('link')

	const handleOpen = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			setTarget(e.currentTarget)
			setUrl(editor.getAttributes('link').href ?? '')
			setShow(true)
		},
		[editor],
	)

	const handleApply = () => {
		if (url) {
			editor
				.chain()
				.focus()
				.extendMarkRange('link')
				.setLink({ href: url })
				.run()
		}
		setShow(false)
		setUrl('')
	}

	const handleRemove = () => {
		editor.chain().focus().extendMarkRange('link').unsetLink().run()
		setShow(false)
		setUrl('')
	}

	return (
		<>
			<AppTooltip
				label={isLink ? 'Editar enlace' : 'Insertar enlace'}
				placement='top'
			>
				<button
					type='button'
					className={toolbarButton}
					data-active={isLink}
					aria-label='Enlace'
					onClick={handleOpen}
				>
					{isLink ? (
						<Unlink size={16} strokeWidth={2} />
					) : (
						<Link2 size={16} strokeWidth={2} />
					)}
				</button>
			</AppTooltip>
		<Overlay
			show={show}
			target={target}
			placement='bottom'
			rootClose
			onHide={() => setShow(false)}
		>
			<Popover style={{ minWidth: 280 }} onMouseDown={(e: React.MouseEvent) => e.preventDefault()}>
					<Popover.Body>
						<div className='d-flex flex-column gap-2'>
							<Form.Label className='mb-0 small fw-semibold'>
								URL del enlace
							</Form.Label>
							<Form.Control
								type='url'
								placeholder='https://ejemplo.com'
								value={url}
								onChange={(e) => setUrl(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter') handleApply()
								}}
								autoFocus
							/>
							<div className='d-flex gap-2 justify-content-end'>
								{isLink && (
									<Button
										variant='outline-danger'
										size='sm'
										onClick={handleRemove}
									>
										Quitar
									</Button>
								)}
								<Button
									variant='primary'
									size='sm'
									onClick={handleApply}
									disabled={!url}
								>
									Aplicar
								</Button>
							</div>
						</div>
					</Popover.Body>
				</Popover>
			</Overlay>
		</>
	)
}
