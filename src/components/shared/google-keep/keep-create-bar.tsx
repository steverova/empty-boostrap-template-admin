import { Image as ImageIcon, ListChecks, X } from 'lucide-react'
import { useState } from 'react'
import { Button, Card, Form } from 'react-bootstrap'

interface KeepCreateBarProps {
	onCreate: (title: string, body: string) => void
}

export default function KeepCreateBar({ onCreate }: KeepCreateBarProps) {
	const [isExpanded, setIsExpanded] = useState(false)
	const [title, setTitle] = useState('')
	const [body, setBody] = useState('')

	const handleCreate = () => {
		const t = title.trim()
		const b = body.trim()
		if (!t && !b) return
		onCreate(t, b)
		setTitle('')
		setBody('')
		setIsExpanded(false)
	}

	const handleCancel = () => {
		setIsExpanded(false)
		setTitle('')
		setBody('')
	}

	if (isExpanded) {
		return (
			<Card className='mb-4 mx-auto' style={{ maxWidth: 600 }}>
				<Card.Body className='p-3'>
					<Form.Control
						className='border-0 shadow-none p-0 mb-2 fw-semibold'
						placeholder='Título'
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						autoFocus
						style={{ fontSize: '1rem' }}
					/>
					<Form.Control
						as='textarea'
						className='border-0 shadow-none p-0'
						placeholder='Tomar nota...'
						value={body}
						onChange={(e) => setBody(e.target.value)}
						rows={3}
						style={{ fontSize: '0.875rem', resize: 'none' }}
					/>
					<div className='d-flex align-items-center justify-content-between mt-2'>
						<Button
							variant='link'
							className='text-body-secondary p-1'
							onClick={handleCancel}
						>
							<X size={16} />
						</Button>
						<Button
							variant='primary'
							size='sm'
							onClick={handleCreate}
							disabled={!title.trim() && !body.trim()}
						>
							Crear
						</Button>
					</div>
				</Card.Body>
			</Card>
		)
	}

	return (
		<div
			className='d-flex align-items-center gap-3 mx-auto mb-4 px-3 py-2 rounded bg-body border'
			style={{ maxWidth: 600, cursor: 'text', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
			onClick={() => setIsExpanded(true)}
			role='button'
			tabIndex={0}
		>
			<span className='flex-grow-1 text-secondary' style={{ fontSize: '0.95rem' }}>
				Crear una nota...
			</span>
			<ListChecks size={20} className='text-secondary' />
			<ImageIcon size={20} className='text-secondary' />
		</div>
	)
}
