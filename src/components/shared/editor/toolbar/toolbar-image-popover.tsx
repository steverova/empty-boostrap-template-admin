import AppTooltip from '@components/shared/tooltip'
import type { Editor } from '@tiptap/react'
import { ImagePlus } from 'lucide-react'
import { useCallback, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Overlay from 'react-bootstrap/Overlay'
import Popover from 'react-bootstrap/Popover'
import { toolbarButton } from '../editor.styles.css'

type ToolbarImagePopoverProps = {
	editor: Editor
}

export default function ToolbarImagePopover({
	editor,
}: ToolbarImagePopoverProps) {
	const [show, setShow] = useState(false)
	const [target, setTarget] = useState<HTMLElement | null>(null)
	const [url, setUrl] = useState('')

	const handleOpen = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
		setTarget(e.currentTarget)
		setUrl('')
		setShow(true)
	}, [])

	const handleApply = () => {
		if (url) {
			editor.chain().focus().setImage({ src: url }).run()
		}
		setShow(false)
		setUrl('')
	}

	return (
		<>
			<AppTooltip label='Insertar imagen' placement='top'>
				<button
					type='button'
					className={toolbarButton}
					aria-label='Insertar imagen'
					onClick={handleOpen}
				>
					<ImagePlus size={16} strokeWidth={2} />
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
								URL de la imagen
							</Form.Label>
							<Form.Control
								type='url'
								placeholder='https://ejemplo.com/imagen.jpg'
								value={url}
								onChange={(e) => setUrl(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter') handleApply()
								}}
								autoFocus
							/>
							<div className='d-flex gap-2 justify-content-end'>
								<Button
									variant='primary'
									size='sm'
									onClick={handleApply}
									disabled={!url}
								>
									Insertar
								</Button>
							</div>
						</div>
					</Popover.Body>
				</Popover>
			</Overlay>
		</>
	)
}
