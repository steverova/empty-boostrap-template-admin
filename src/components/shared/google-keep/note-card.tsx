import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Palette, Pin, PinOff, Plus, Tag, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Badge, Button, Form } from 'react-bootstrap'
import { keepColorDot, keepColorDotActive, keepNote, keepNoteActions } from './google-keep.css'
import { COLOR_BOOTSTRAP_MAP, COLOR_DOT_MAP, COLOR_LABELS, type KeepColor, type KeepNote } from './types'

function NoteCardEdit({
	note,
	onSave,
}: {
	note: KeepNote
	onSave: (title: string, body: string) => void
}) {
	const [title, setTitle] = useState(note.title)
	const [body, setBody] = useState(note.body)
	const textareaRef = useRef<HTMLTextAreaElement>(null)

	const handleSave = useCallback(() => {
		onSave(title, body)
	}, [title, body, onSave])

	const adjustHeight = useCallback(() => {
		const el = textareaRef.current
		if (!el) return
		el.style.height = 'auto'
		el.style.height = `${el.scrollHeight}px`
	}, [])

	useEffect(() => {
		adjustHeight()
	}, [body, adjustHeight])

	return (
		<div className='card-body p-3'>
			<Form.Control
				className='border-0 shadow-none p-0 mb-2 fw-semibold'
				placeholder='Título'
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				onClick={(e) => e.stopPropagation()}
				onBlur={handleSave}
				style={{ fontSize: '0.95rem' }}
			/>
			<Form.Control
				as='textarea'
				ref={textareaRef}
				className='border-0 shadow-none p-0'
				placeholder='Tomar nota...'
				value={body}
				onChange={(e) => {
					setBody(e.target.value)
					adjustHeight()
				}}
				onClick={(e) => e.stopPropagation()}
				onBlur={handleSave}
				rows={1}
				style={{ fontSize: '0.85rem', resize: 'none', overflow: 'hidden', minHeight: 24 }}
			/>
		</div>
	)
}

function NoteCardView({
	note,
	onToggleCheck,
}: {
	note: KeepNote
	onToggleCheck?: (checkId: string) => void
}) {
	return (
		<div className='card-body p-3'>
			<div className='d-flex align-items-start justify-content-between gap-2 mb-1'>
				{note.title && (
					<h6 className='mb-0 fw-semibold flex-grow-1' style={{ fontSize: '0.95rem', wordBreak: 'break-word' }}>
						{note.title}
					</h6>
				)}
			</div>

			{note.body && (
				<p className='mb-2 text-body' style={{ fontSize: '0.85rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
					{note.body}
				</p>
			)}

			{note.checklist && note.checklist.length > 0 && (
				<div className='mb-2'>
					{note.checklist.map((item) => (
						<div
							key={item.id}
							className={`d-flex align-items-center gap-2 py-1 ${item.checked ? 'text-decoration-line-through opacity-50' : ''}`}
							onClick={(e) => {
								e.stopPropagation()
								onToggleCheck?.(item.id)
							}}
							style={{ fontSize: '0.85rem', cursor: 'pointer' }}
						>
							<Form.Check type='checkbox' checked={item.checked} readOnly className='mb-0' />
							<span>{item.text}</span>
						</div>
					))}
				</div>
			)}
		</div>
	)
}

function NoteCardColorPicker({
	currentColor,
	onSelect,
}: {
	currentColor: KeepColor
	onSelect: (color: KeepColor) => void
}) {
	return (
		<div className='d-flex gap-1 p-2 border-top' onClick={(e) => e.stopPropagation()}>
			{Object.keys(COLOR_DOT_MAP).map((c) => (
				<button
					key={c}
					type='button'
					className={currentColor === c ? keepColorDotActive : keepColorDot}
					style={{ backgroundColor: COLOR_DOT_MAP[c as KeepColor] }}
					onClick={() => onSelect(c as KeepColor)}
					aria-label={COLOR_LABELS[c as KeepColor]}
					title={COLOR_LABELS[c as KeepColor]}
				/>
			))}
		</div>
	)
}

function NoteCardLabelPicker({
	noteLabels,
	allLabels,
	onAdd,
	onRemove,
}: {
	noteLabels: string[]
	allLabels: string[]
	onAdd: (label: string) => void
	onRemove: (label: string) => void
}) {
	const [newLabelInput, setNewLabelInput] = useState('')

	return (
		<div className='px-3 py-2 border-top bg-body' onClick={(e) => e.stopPropagation()}>
			<div className='d-flex flex-wrap gap-1 mb-2'>
				{allLabels.map((label) => {
					const isActive = noteLabels.includes(label)
					return (
						<button
							key={label}
							className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline-secondary'}`}
							onClick={() => {
								if (isActive) onRemove(label)
								else onAdd(label)
							}}
						>
							{label}
						</button>
					)
				})}
			</div>
			<div className='d-flex align-items-center gap-1'>
				<Form.Control
					className='form-control-sm'
					placeholder='Nueva etiqueta...'
					value={newLabelInput}
					onChange={(e) => setNewLabelInput(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter' && newLabelInput.trim()) {
							onAdd(newLabelInput.trim())
							setNewLabelInput('')
						}
					}}
					style={{ fontSize: '0.75rem' }}
				/>
				<Button
					variant='outline-primary'
					size='sm'
					disabled={!newLabelInput.trim()}
					onClick={() => {
						if (newLabelInput.trim()) {
							onAdd(newLabelInput.trim())
							setNewLabelInput('')
						}
					}}
				>
					<Plus size={12} />
				</Button>
			</div>
		</div>
	)
}

function NoteCardLabels({
	labels,
	onRemove,
}: {
	labels: string[]
	onRemove: (label: string) => void
}) {
	if (labels.length === 0) return null
	return (
		<div className='d-flex flex-wrap gap-1'>
			{labels.map((label) => (
				<Badge
					key={label}
					bg='secondary'
					className='small'
					role='button'
					onClick={(e) => {
						e.stopPropagation()
						onRemove(label)
					}}
					style={{ cursor: 'pointer', fontSize: '0.65rem' }}
					title='Quitar etiqueta'
				>
					{label} ×
				</Badge>
			))}
		</div>
	)
}

export default function NoteCard({
	note,
	isList,
	allLabels,
	onTogglePin,
	onDelete,
	onToggleCheck,
	onColorChange,
	onUpdate,
	onLabelRemove,
	onLabelAdd,
}: {
	note: KeepNote
	isList?: boolean
	allLabels: string[]
	onTogglePin?: () => void
	onDelete?: () => void
	onToggleCheck?: (checkId: string) => void
	onColorChange?: (color: KeepColor) => void
	onUpdate?: (note: KeepNote) => void
	onLabelRemove?: (label: string) => void
	onLabelAdd?: (label: string) => void
}) {
	const [isEditing, setIsEditing] = useState(false)
	const [showColors, setShowColors] = useState(false)
	const [showLabels, setShowLabels] = useState(false)
	const [editMinHeight, setEditMinHeight] = useState<number | undefined>(undefined)
	const cardRef = useRef<HTMLDivElement>(null)

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: note.id })

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
		zIndex: isDragging ? 10 : undefined,
	}

	const bootstrapColor = COLOR_BOOTSTRAP_MAP[note.color] || ''

	const handleEnterEdit = useCallback(() => {
		if (cardRef.current) {
			setEditMinHeight(cardRef.current.offsetHeight)
		}
		setIsEditing(true)
	}, [])

	const handleExitEdit = useCallback(() => {
		setIsEditing(false)
		setEditMinHeight(undefined)
	}, [])

	useEffect(() => {
		if (!isEditing) return

		const handleMouseDown = (e: MouseEvent) => {
			if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
				if (cardRef.current.querySelector('form, input, textarea')) {
					cardRef.current.querySelector<HTMLElement>('input, textarea')?.blur()
				}
				setTimeout(() => handleExitEdit(), 0)
			}
		}

		document.addEventListener('mousedown', handleMouseDown)
		return () => document.removeEventListener('mousedown', handleMouseDown)
	}, [isEditing, handleExitEdit])

	return (
		<div
			ref={(node) => {
				setNodeRef(node)
				;(cardRef as React.MutableRefObject<HTMLDivElement | null>).current = node
			}}
			style={{ ...style, minHeight: editMinHeight }}
			className={`${keepNote} card ${bootstrapColor} ${note.pinned && !isList ? 'border-primary' : ''}`}
			onClick={() => !isEditing && handleEnterEdit()}
		>
			{note.imageUrl && (
				<img src={note.imageUrl} alt='' className='card-img-top' style={{ maxHeight: 200, objectFit: 'cover' }} />
			)}

			{isEditing ? (
				<NoteCardEdit
					note={note}
					onSave={(title, body) => {
						onUpdate?.({ ...note, title, body, updatedAt: new Date() })
						handleExitEdit()
					}}
				/>
			) : (
				<>
					<div className='card-body p-0'>
						<div className='d-flex align-items-start justify-content-between gap-2 px-3 pt-3 pb-0'>
							<button
								className='btn btn-sm btn-link p-0 text-body-secondary text-decoration-none'
								{...attributes}
								{...listeners}
								onClick={(e) => e.stopPropagation()}
								style={{ cursor: 'grab', touchAction: 'none' }}
								title='Arrastrar'
							>
								<GripVertical size={14} />
							</button>
							<button
								className='btn btn-sm btn-link p-0 text-body-secondary text-decoration-none'
								onClick={(e) => {
									e.stopPropagation()
									onTogglePin?.()
								}}
								title={note.pinned ? 'Desanclar' : 'Anclar'}
							>
								{note.pinned ? <PinOff size={16} /> : <Pin size={16} />}
							</button>
						</div>
						<NoteCardView note={note} onToggleCheck={onToggleCheck} />
					</div>

					<div className='card-footer bg-transparent border-top-0 d-flex align-items-center justify-content-between px-2 pb-2 pt-0'>
						<NoteCardLabels labels={note.labels ?? []} onRemove={(label) => onLabelRemove?.(label)} />
						<div className={keepNoteActions}>
							<button
								className='btn btn-sm btn-link text-body-secondary text-decoration-none p-1'
								onClick={(e) => {
									e.stopPropagation()
									setShowLabels(!showLabels)
									setShowColors(false)
								}}
								title='Etiquetas'
							>
								<Tag size={16} />
							</button>
							<button
								className='btn btn-sm btn-link text-body-secondary text-decoration-none p-1'
								onClick={(e) => {
									e.stopPropagation()
									setShowColors(!showColors)
									setShowLabels(false)
								}}
								title='Color'
							>
								<Palette size={16} />
							</button>
							<button
								className='btn btn-sm btn-link text-body-secondary text-decoration-none p-1'
								onClick={(e) => {
									e.stopPropagation()
									onDelete?.()
								}}
								title='Eliminar'
							>
								<Trash2 size={16} />
							</button>
						</div>
					</div>
				</>
			)}

			{showLabels && (
				<NoteCardLabelPicker
					noteLabels={note.labels ?? []}
					allLabels={allLabels}
					onAdd={(label) => onLabelAdd?.(label)}
					onRemove={(label) => onLabelRemove?.(label)}
				/>
			)}

			{showColors && (
				<NoteCardColorPicker
					currentColor={note.color}
					onSelect={(color) => {
						onColorChange?.(color)
						setShowColors(false)
					}}
				/>
			)}
		</div>
	)
}
