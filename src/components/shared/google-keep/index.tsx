import { useCallback, useMemo, useRef, useState } from 'react'
import {
	DndContext,
	closestCenter,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
} from '@dnd-kit/core'
import {
	arrayMove,
	SortableContext,
	useSortable,
	rectSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
	Pin,
	PinOff,
	Trash2,
	Palette,
	PaletteIcon,
	Image as ImageIcon,
	ListChecks,
	X,
	GripVertical,
	LayoutGrid,
	List,
	Tag,
	Plus,
} from 'lucide-react'
import {
	keepContainer,
	keepHeader,
	keepSearch,
	keepGrid,
	keepMasonry,
	keepNote,
	keepNotePinned,
	keepNoteHeader,
	keepNoteTitle,
	keepNoteBody,
	keepNoteImage,
	keepNoteChecklist,
	keepCheckItem,
	keepCheckItemDone,
	keepNoteFooter,
	keepNoteLabels,
	keepLabel,
	keepNoteActions,
	keepActionBtn,
	keepColorPicker,
	keepColorDot,
	keepColorDotActive,
	keepEmptyState,
	keepCreateBar,
	keepCreateInput,
	keepCreateExpanded,
	keepCreateTitleInput,
	keepCreateBodyInput,
	keepCreateActions,
} from './google-keep.css'

export type KeepColor = 'default' | 'red' | 'orange' | 'yellow' | 'green' | 'cyan' | 'blue' | 'purple' | 'pink'

export interface KeepCheckItem {
	id: string
	text: string
	checked: boolean
}

export interface KeepNote {
	id: string
	title: string
	body: string
	color: KeepColor
	pinned: boolean
	labels?: string[]
	imageUrl?: string
	checklist?: KeepCheckItem[]
	createdAt: Date
	updatedAt: Date
}

export type ViewMode = 'grid' | 'list'

export interface GoogleKeepProps {
	initialNotes?: KeepNote[]
	className?: string
}

const COLOR_BOOTSTRAP_MAP: Record<KeepColor, string> = {
	default: '',
	red: 'bg-danger-subtle',
	orange: 'bg-warning-subtle',
	yellow: 'bg-warning-subtle',
	green: 'bg-success-subtle',
	cyan: 'bg-info-subtle',
	blue: 'bg-primary-subtle',
	purple: 'bg-purple-subtle',
	pink: 'bg-pink-subtle',
}

const COLOR_DOT_MAP: Record<KeepColor, string> = {
	default: 'var(--bs-body-bg)',
	red: 'var(--bs-danger)',
	orange: 'var(--bs-warning)',
	yellow: '#fff3cd',
	green: 'var(--bs-success)',
	cyan: 'var(--bs-info)',
	blue: 'var(--bs-primary)',
	purple: '#6f42c1',
	pink: '#d63384',
}

const COLOR_LABELS: Record<KeepColor, string> = {
	default: 'Por defecto',
	red: 'Rojo',
	orange: 'Naranja',
	yellow: 'Amarillo',
	green: 'Verde',
	cyan: 'Cyan',
	blue: 'Azul',
	purple: 'Púrpura',
	pink: 'Rosa',
}

function extractAllLabels(notes: KeepNote[]): string[] {
	const labelSet = new Set<string>()
	for (const note of notes) {
		note.labels?.forEach((l) => labelSet.add(l))
	}
	return Array.from(labelSet).sort()
}

function ColorDot({
	color,
	isActive,
	onClick,
}: {
	color: KeepColor
	isActive: boolean
	onClick: () => void
}) {
	const className = isActive ? keepColorDotActive : keepColorDot
	return (
		<button
			className={className}
			style={{ backgroundColor: COLOR_DOT_MAP[color] }}
			onClick={onClick}
			aria-label={COLOR_LABELS[color]}
			title={COLOR_LABELS[color]}
		/>
	)
}

function NoteCard({
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
	const [showColors, setShowColors] = useState(false)
	const [showLabels, setShowLabels] = useState(false)
	const [newLabelInput, setNewLabelInput] = useState('')
	const [isEditing, setIsEditing] = useState(false)
	const [editTitle, setEditTitle] = useState(note.title)
	const [editBody, setEditBody] = useState(note.body)

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

	const handleSave = useCallback(() => {
		if (onUpdate) {
			onUpdate({ ...note, title: editTitle, body: editBody, updatedAt: new Date() })
		}
		setIsEditing(false)
	}, [editTitle, editBody, note, onUpdate])

	const bootstrapColor = COLOR_BOOTSTRAP_MAP[note.color] || ''
	const noteClass = isList ? `${keepNote} ${bootstrapColor}` : `${note.pinned ? keepNotePinned : keepNote} ${bootstrapColor}`

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={noteClass.trim()}
			onClick={() => !isEditing && setIsEditing(true)}
		>
			{note.imageUrl && (
				<img src={note.imageUrl} alt='' className={keepNoteImage} />
			)}

			{isEditing ? (
				<div style={{ padding: '12px 12px 0 12px' }}>
					<input
						className={keepCreateTitleInput}
						value={editTitle}
						onChange={(e) => setEditTitle(e.target.value)}
						placeholder='Título'
						onClick={(e) => e.stopPropagation()}
						onBlur={handleSave}
					/>
					<textarea
						className={keepCreateBodyInput}
						value={editBody}
						onChange={(e) => setEditBody(e.target.value)}
						placeholder='Tomar nota...'
						onClick={(e) => e.stopPropagation()}
						onBlur={handleSave}
					/>
				</div>
			) : (
				<>
					<div className={keepNoteHeader}>
						<button
							className={keepActionBtn}
							{...attributes}
							{...listeners}
							onClick={(e) => e.stopPropagation()}
							style={{ cursor: 'grab', touchAction: 'none' }}
							title='Arrastrar'
						>
							<GripVertical size={14} />
						</button>
						{note.title && <h6 className={keepNoteTitle}>{note.title}</h6>}
						<button
							className={keepActionBtn}
							onClick={(e) => {
								e.stopPropagation()
								onTogglePin?.()
							}}
							title={note.pinned ? 'Desanclar' : 'Anclar'}
						>
							{note.pinned ? <PinOff size={16} /> : <Pin size={16} />}
						</button>
					</div>

					{note.body && <div className={keepNoteBody}>{note.body}</div>}

					{note.checklist && note.checklist.length > 0 && (
						<div className={keepNoteChecklist}>
							{note.checklist.map((item) => (
								<div
									key={item.id}
									className={item.checked ? keepCheckItemDone : keepCheckItem}
									onClick={(e) => {
										e.stopPropagation()
										onToggleCheck?.(item.id)
									}}
								>
									<input
										type='checkbox'
										checked={item.checked}
										readOnly
										style={{ cursor: 'pointer' }}
									/>
									<span>{item.text}</span>
								</div>
							))}
						</div>
					)}
				</>
			)}

			<div className={keepNoteFooter}>
				{note.labels && note.labels.length > 0 && (
					<div className={keepNoteLabels}>
						{note.labels.map((label) => (
							<span
								key={label}
								className={keepLabel}
								onClick={(e) => {
									e.stopPropagation()
									onLabelRemove?.(label)
								}}
								style={{ cursor: 'pointer' }}
								title='Quitar etiqueta'
							>
								{label} ×
							</span>
						))}
					</div>
				)}
				<div className={keepNoteActions}>
					<button
						className={keepActionBtn}
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
						className={keepActionBtn}
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
						className={keepActionBtn}
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

			{showLabels && (
				<div
					className='px-3 py-2 border-top'
					style={{ backgroundColor: 'var(--bs-body-bg)' }}
					onClick={(e) => e.stopPropagation()}
				>
					<div className='d-flex flex-wrap gap-1 mb-2'>
						{allLabels.map((label) => {
							const isActive = note.labels?.includes(label)
							return (
								<button
									key={label}
									className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline-secondary'}`}
									onClick={() => {
										if (isActive) {
											onLabelRemove?.(label)
										} else {
											onLabelAdd?.(label)
										}
									}}
								>
									{label}
								</button>
							)
						})}
					</div>
					<div className='d-flex align-items-center gap-1'>
						<input
							className='form-control form-control-sm'
							placeholder='Nueva etiqueta...'
							value={newLabelInput}
							onChange={(e) => setNewLabelInput(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter' && newLabelInput.trim()) {
									onLabelAdd?.(newLabelInput.trim())
									setNewLabelInput('')
								}
							}}
							style={{ fontSize: '0.75rem' }}
						/>
						<button
							className='btn btn-sm btn-outline-primary'
							disabled={!newLabelInput.trim()}
							onClick={() => {
								if (newLabelInput.trim()) {
									onLabelAdd?.(newLabelInput.trim())
									setNewLabelInput('')
								}
							}}
						>
							<Plus size={12} />
						</button>
					</div>
				</div>
			)}

			{showColors && (
				<div className={keepColorPicker} onClick={(e) => e.stopPropagation()}>
					{Object.keys(COLOR_DOT_MAP).map((c) => (
						<ColorDot
							key={c}
							color={c as KeepColor}
							isActive={note.color === c}
							onClick={() => {
								onColorChange?.(c as KeepColor)
								setShowColors(false)
							}}
						/>
					))}
				</div>
			)}
		</div>
	)
}

export default function GoogleKeep({
	initialNotes = [],
	className,
}: GoogleKeepProps) {
	const [notes, setNotes] = useState<KeepNote[]>(initialNotes)
	const [search, setSearch] = useState('')
	const [viewMode, setViewMode] = useState<ViewMode>('grid')
	const [selectedLabel, setSelectedLabel] = useState<string | null>(null)
	const [newLabelName, setNewLabelName] = useState('')
	const [showNewLabel, setShowNewLabel] = useState(false)
	const [isCreating, setIsCreating] = useState(false)
	const [createTitle, setCreateTitle] = useState('')
	const [createBody, setCreateBody] = useState('')
	const createRef = useRef<HTMLDivElement>(null)

	const allLabels = useMemo(() => extractAllLabels(notes), [notes])

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
	)

	const filteredNotes = useMemo(() => {
		let result = notes

		if (selectedLabel) {
			result = result.filter((n) => n.labels?.includes(selectedLabel))
		}

		if (search.trim()) {
			const q = search.toLowerCase()
			result = result.filter(
				(n) =>
					n.title.toLowerCase().includes(q) ||
					n.body.toLowerCase().includes(q) ||
					n.labels?.some((l) => l.toLowerCase().includes(q)),
			)
		}

		return result
	}, [notes, search, selectedLabel])

	const pinnedNotes = useMemo(() => filteredNotes.filter((n) => n.pinned), [filteredNotes])
	const otherNotes = useMemo(() => filteredNotes.filter((n) => !n.pinned), [filteredNotes])

	const handleCreate = useCallback(() => {
		const title = createTitle.trim()
		const body = createBody.trim()
		if (!title && !body) return

		const newNote: KeepNote = {
			id: `n-${Date.now()}`,
			title,
			body,
			color: 'default',
			pinned: false,
			createdAt: new Date(),
			updatedAt: new Date(),
		}

		setNotes((prev) => [newNote, ...prev])
		setCreateTitle('')
		setCreateBody('')
		setIsCreating(false)
	}, [createTitle, createBody])

	const handleUpdate = useCallback((updated: KeepNote) => {
		setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)))
	}, [])

	const handleDelete = useCallback((noteId: string) => {
		setNotes((prev) => prev.filter((n) => n.id !== noteId))
	}, [])

	const handleTogglePin = useCallback((noteId: string) => {
		setNotes((prev) =>
			prev.map((n) =>
				n.id === noteId ? { ...n, pinned: !n.pinned, updatedAt: new Date() } : n,
			),
		)
	}, [])

	const handleToggleCheck = useCallback((noteId: string, checkId: string) => {
		setNotes((prev) =>
			prev.map((n) =>
				n.id === noteId
					? {
							...n,
							checklist: n.checklist?.map((c) =>
								c.id === checkId ? { ...c, checked: !c.checked } : c,
							),
							updatedAt: new Date(),
						}
					: n,
			),
		)
	}, [])

	const handleColorChange = useCallback((noteId: string, color: KeepColor) => {
		setNotes((prev) =>
			prev.map((n) =>
				n.id === noteId ? { ...n, color, updatedAt: new Date() } : n,
			),
		)
	}, [])

	const handleDragEnd = useCallback(
		(event: DragEndEvent) => {
			const { active, over } = event
			if (!over || active.id === over.id) return

			setNotes((prev) => {
				const oldIndex = prev.findIndex((n) => n.id === active.id)
				const newIndex = prev.findIndex((n) => n.id === over.id)
				if (oldIndex === -1 || newIndex === -1) return prev
				return arrayMove(prev, oldIndex, newIndex)
			})
		},
		[],
	)

	const handleRemoveLabel = useCallback((noteId: string, label: string) => {
		setNotes((prev) =>
			prev.map((n) =>
				n.id === noteId
					? { ...n, labels: n.labels?.filter((l) => l !== label) ?? [], updatedAt: new Date() }
					: n,
			),
		)
	}, [])

	const handleAddLabelToNote = useCallback((noteId: string, label: string) => {
		setNotes((prev) =>
			prev.map((n) =>
				n.id === noteId && !n.labels?.includes(label)
					? { ...n, labels: [...(n.labels ?? []), label], updatedAt: new Date() }
					: n,
			),
		)
	}, [])

	const handleAddLabel = useCallback(() => {
		const label = newLabelName.trim()
		if (!label) return
		setShowNewLabel(false)
		setNewLabelName('')
		setSelectedLabel(label)
	}, [newLabelName])

	const isListView = viewMode === 'list'

	return (
		<div className={`${keepContainer} ${className ?? ''}`}>
			<div className={keepHeader}>
				<input
					className={keepSearch}
					placeholder='Buscar notas...'
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
				<div className='d-flex align-items-center gap-1'>
					<button
						className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-secondary'}`}
						onClick={() => setViewMode('grid')}
						title='Vista cuadrícula'
					>
						<LayoutGrid size={16} />
					</button>
					<button
						className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-secondary'}`}
						onClick={() => setViewMode('list')}
						title='Vista lista'
					>
						<List size={16} />
					</button>
				</div>
			</div>

			<div className={keepGrid}>
				<div ref={createRef}>
					{isCreating ? (
						<div
							className={keepCreateExpanded}
							style={{ backgroundColor: 'var(--bs-body-bg)' }}
						>
							<input
								className={keepCreateTitleInput}
								placeholder='Título'
								value={createTitle}
								onChange={(e) => setCreateTitle(e.target.value)}
								autoFocus
							/>
							<textarea
								className={keepCreateBodyInput}
								placeholder='Tomar nota...'
								value={createBody}
								onChange={(e) => setCreateBody(e.target.value)}
							/>
							<div className={keepCreateActions}>
								<button
									className={keepActionBtn}
									onClick={() => {
										setIsCreating(false)
										setCreateTitle('')
										setCreateBody('')
									}}
								>
									<X size={16} />
								</button>
								<button
									className='btn btn-sm btn-primary'
									onClick={handleCreate}
									disabled={!createTitle.trim() && !createBody.trim()}
								>
									Crear
								</button>
							</div>
						</div>
					) : (
						<div
							className={keepCreateBar}
							onClick={() => setIsCreating(true)}
							role='button'
							tabIndex={0}
						>
							<span className={keepCreateInput} style={{ cursor: 'text' }}>
								Crear una nota...
							</span>
							<ListChecks size={20} className='text-secondary' />
							<ImageIcon size={20} className='text-secondary' />
						</div>
					)}
				</div>

				{allLabels.length > 0 && (
					<div className='d-flex flex-wrap gap-1 mb-3'>
						<button
							className={`btn btn-sm ${selectedLabel === null ? 'btn-primary' : 'btn-outline-secondary'}`}
							onClick={() => setSelectedLabel(null)}
						>
							Todas
						</button>
						{allLabels.map((label) => (
							<button
								key={label}
								className={`btn btn-sm ${selectedLabel === label ? 'btn-primary' : 'btn-outline-secondary'}`}
								onClick={() => setSelectedLabel(selectedLabel === label ? null : label)}
							>
								<Tag size={12} className='me-1' />
								{label}
							</button>
						))}
						<button
							className='btn btn-sm btn-outline-secondary'
							onClick={() => setShowNewLabel(!showNewLabel)}
							style={{ borderStyle: 'dashed' }}
						>
							<Plus size={12} className='me-1' />
							Nueva
						</button>
					</div>
				)}

				{allLabels.length === 0 && (
					<div className='d-flex flex-wrap gap-1 mb-3'>
						<button
							className='btn btn-sm btn-outline-secondary'
							onClick={() => setShowNewLabel(!showNewLabel)}
							style={{ borderStyle: 'dashed' }}
						>
							<Plus size={12} className='me-1' />
							Crear etiqueta
						</button>
					</div>
				)}

				{showNewLabel && (
					<div className='d-flex align-items-center gap-2 mb-3'>
						<input
							className='form-control form-control-sm'
							placeholder='Nombre de la etiqueta...'
							value={newLabelName}
							onChange={(e) => setNewLabelName(e.target.value)}
							onKeyDown={(e) => e.key === 'Enter' && handleAddLabel()}
							autoFocus
							style={{ maxWidth: 250 }}
						/>
						<button className='btn btn-sm btn-primary' onClick={handleAddLabel}>
							Agregar
						</button>
						<button
							className='btn btn-sm btn-outline-secondary'
							onClick={() => {
								setShowNewLabel(false)
								setNewLabelName('')
							}}
						>
							Cancelar
						</button>
					</div>
				)}

				{filteredNotes.length === 0 ? (
					<div className={keepEmptyState}>
						<PaletteIcon size={48} strokeWidth={1} />
						<h5 className='mt-3 mb-1'>
							{search || selectedLabel ? 'No se encontraron notas' : 'Las notas que agregues aparecerán aquí'}
						</h5>
						<p className='text-muted mb-0'>
							{search || selectedLabel ? 'Intenta con otros términos' : 'Haz clic en "Crear una nota..." para empezar'}
						</p>
					</div>
				) : (
					<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
						{pinnedNotes.length > 0 && (
							<>
								<h6 className='text-muted text-uppercase mb-2' style={{ fontSize: '0.7rem', letterSpacing: 1 }}>
									Fijadas
								</h6>
								<SortableContext items={pinnedNotes.map((n) => n.id)} strategy={rectSortingStrategy}>
									<div className={isListView ? 'd-flex flex-column gap-2' : keepMasonry}>
										{pinnedNotes.map((note) => (
											<NoteCard
												key={note.id}
												note={note}
												isList={isListView}
												allLabels={allLabels}
												onTogglePin={() => handleTogglePin(note.id)}
												onDelete={() => handleDelete(note.id)}
												onToggleCheck={(checkId) => handleToggleCheck(note.id, checkId)}
												onColorChange={(color) => handleColorChange(note.id, color)}
												onUpdate={handleUpdate}
												onLabelRemove={(label) => handleRemoveLabel(note.id, label)}
												onLabelAdd={(label) => handleAddLabelToNote(note.id, label)}
											/>
										))}
									</div>
								</SortableContext>
							</>
						)}

						{otherNotes.length > 0 && (
							<>
								{pinnedNotes.length > 0 && (
									<h6 className='text-muted text-uppercase mb-2 mt-3' style={{ fontSize: '0.7rem', letterSpacing: 1 }}>
										Otras
									</h6>
								)}
								<SortableContext items={otherNotes.map((n) => n.id)} strategy={rectSortingStrategy}>
									<div className={isListView ? 'd-flex flex-column gap-2' : keepMasonry}>
										{otherNotes.map((note) => (
											<NoteCard
												key={note.id}
												note={note}
												isList={isListView}
												allLabels={allLabels}
												onTogglePin={() => handleTogglePin(note.id)}
												onDelete={() => handleDelete(note.id)}
												onToggleCheck={(checkId) => handleToggleCheck(note.id, checkId)}
												onColorChange={(color) => handleColorChange(note.id, color)}
												onUpdate={handleUpdate}
												onLabelRemove={(label) => handleRemoveLabel(note.id, label)}
												onLabelAdd={(label) => handleAddLabelToNote(note.id, label)}
											/>
										))}
									</div>
								</SortableContext>
							</>
						)}
					</DndContext>
				)}
			</div>
		</div>
	)
}
