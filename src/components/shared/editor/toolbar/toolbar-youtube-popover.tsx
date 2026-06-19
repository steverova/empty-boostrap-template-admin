import { useState, useCallback } from 'react'
import type { Editor } from '@tiptap/react'
import Overlay from 'react-bootstrap/Overlay'
import Popover from 'react-bootstrap/Popover'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import AppTooltip from '@components/shared/tooltip'
import { Video } from 'lucide-react'
import { toolbarButton } from '../editor.styles.css'
import { extractYouTubeId } from '../extensions/youtube'

type ToolbarYouTubePopoverProps = {
	editor: Editor
}

export default function ToolbarYouTubePopover({ editor }: ToolbarYouTubePopoverProps) {
	const [show, setShow] = useState(false)
	const [target, setTarget] = useState<HTMLElement | null>(null)
	const [url, setUrl] = useState('')

	const handleOpen = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			setTarget(e.currentTarget)
			setUrl('')
			setShow(true)
		},
		[],
	)

	const handleApply = () => {
		const videoId = extractYouTubeId(url)
		if (videoId) {
			const embedUrl = `https://www.youtube.com/embed/${videoId}`
			editor
				.chain()
				.focus()
				.insertContent({
					type: 'youtube',
					attrs: { src: embedUrl },
				})
				.run()
		}
		setShow(false)
		setUrl('')
	}

	return (
		<>
			<AppTooltip label='Insertar YouTube' placement='bottom'>
				<button
					type='button'
					className={toolbarButton}
					aria-label='Insertar YouTube'
					onClick={handleOpen}
				>
					<Video size={16} strokeWidth={2} />
				</button>
			</AppTooltip>
			<Overlay
				show={show}
				target={target}
				placement='bottom'
				rootClose
				onHide={() => setShow(false)}
				container={document.querySelector('.modal-body') ?? document.body}
			>
				<Popover style={{ minWidth: 300, zIndex: 1060 }} onMouseDown={(e: React.MouseEvent) => e.preventDefault()}>
					<Popover.Body>
						<div className='d-flex flex-column gap-2'>
							<Form.Label className='mb-0 small fw-semibold'>
								URL del video de YouTube
							</Form.Label>
							<Form.Control
								type='url'
								placeholder='https://www.youtube.com/watch?v=...'
								value={url}
								onChange={(e) => setUrl(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter') handleApply()
								}}
								autoFocus
							/>
							{url && !extractYouTubeId(url) && (
								<div className='small text-danger'>
									URL no válida. Ingresa una URL de YouTube.
								</div>
							)}
							<div className='d-flex gap-2 justify-content-end'>
								<Button
									variant='primary'
									size='sm'
									onClick={handleApply}
									disabled={!url || !extractYouTubeId(url)}
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
