import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import {
	arrayMove,
	rectSortingStrategy,
	SortableContext,
} from '@dnd-kit/sortable'
import { Palette } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { masonryGrid } from './google-keep.css'
import KeepCreateBar from './keep-create-bar'
import KeepHeader from './keep-header'
import KeepLabelFilter from './keep-label-filter'
import NoteCard from './note-card'
import {
	extractAllLabels,
	type KeepColor,
	type KeepNote,
	type ViewMode,
} from './types'

export type { KeepCheckItem, KeepColor, KeepNote, ViewMode } from './types'

export interface GoogleKeepProps {
	initialNotes?: KeepNote[]
	className?: string
}

export default function GoogleKeep({
	initialNotes = [],
	className,
}: GoogleKeepProps) {
	const [notes, setNotes] = useState<KeepNote[]>(initialNotes)
	const [search, setSearch] = useState('')
	const [viewMode, setViewMode] = useState<ViewMode>('grid')
	const [selectedLabel, setSelectedLabel] = useState<string | null>(null)

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

	const pinnedNotes = useMemo(
		() => filteredNotes.filter((n) => n.pinned),
		[filteredNotes],
	)
	const otherNotes = useMemo(
		() => filteredNotes.filter((n) => !n.pinned),
		[filteredNotes],
	)

	const handleCreate = useCallback((title: string, body: string) => {
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
	}, [])

	const handleUpdate = useCallback((updated: KeepNote) => {
		setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)))
	}, [])

	const handleDelete = useCallback((noteId: string) => {
		setNotes((prev) => prev.filter((n) => n.id !== noteId))
	}, [])

	const handleTogglePin = useCallback((noteId: string) => {
		setNotes((prev) =>
			prev.map((n) =>
				n.id === noteId
					? { ...n, pinned: !n.pinned, updatedAt: new Date() }
					: n,
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

	const handleDragEnd = useCallback((event: DragEndEvent) => {
		const { active, over } = event
		if (!over || active.id === over.id) return
		setNotes((prev) => {
			const oldIndex = prev.findIndex((n) => n.id === active.id)
			const newIndex = prev.findIndex((n) => n.id === over.id)
			if (oldIndex === -1 || newIndex === -1) return prev
			return arrayMove(prev, oldIndex, newIndex)
		})
	}, [])

	const handleRemoveLabel = useCallback((noteId: string, label: string) => {
		setNotes((prev) =>
			prev.map((n) =>
				n.id === noteId
					? {
							...n,
							labels: n.labels?.filter((l) => l !== label) ?? [],
							updatedAt: new Date(),
						}
					: n,
			),
		)
	}, [])

	const handleAddLabelToNote = useCallback((noteId: string, label: string) => {
		setNotes((prev) =>
			prev.map((n) =>
				n.id === noteId && !n.labels?.includes(label)
					? {
							...n,
							labels: [...(n.labels ?? []), label],
							updatedAt: new Date(),
						}
					: n,
			),
		)
	}, [])

	const handleAddLabel = useCallback((label: string) => {
		setSelectedLabel(label)
	}, [])

	const isListView = viewMode === 'list'

	const noteCardProps = {
		isList: isListView,
		allLabels,
		onTogglePin: handleTogglePin,
		onDelete: handleDelete,
		onToggleCheck: handleToggleCheck,
		onColorChange: handleColorChange,
		onUpdate: handleUpdate,
		onLabelRemove: handleRemoveLabel,
		onLabelAdd: handleAddLabelToNote,
	}

	return (
		<div className={`d-flex flex-column h-100 ${className ?? ''}`}>
			<KeepHeader
				search={search}
				onSearchChange={setSearch}
				viewMode={viewMode}
				onViewModeChange={setViewMode}
			/>

			<div className='flex-grow-1 overflow-auto p-3'>
				<KeepCreateBar onCreate={handleCreate} />

				<KeepLabelFilter
					labels={allLabels}
					selectedLabel={selectedLabel}
					onSelectLabel={setSelectedLabel}
					onAddLabel={handleAddLabel}
				/>

				{filteredNotes.length === 0 ? (
					<div className='d-flex flex-column align-items-center justify-content-center py-5 text-secondary'>
						<Palette size={48} strokeWidth={1} />
						<h5 className='mt-3 mb-1'>
							{search || selectedLabel
								? 'No se encontraron notas'
								: 'Las notas que agregues aparecerán aquí'}
						</h5>
						<p className='text-muted mb-0'>
							{search || selectedLabel
								? 'Intenta con otros términos'
								: 'Haz clic en "Crear una nota..." para empezar'}
						</p>
					</div>
				) : (
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}
					>
						{pinnedNotes.length > 0 && (
							<>
								<h6
									className='text-muted text-uppercase mb-2'
									style={{ fontSize: '0.7rem', letterSpacing: 1 }}
								>
									Fijadas
								</h6>
								<SortableContext
									items={pinnedNotes.map((n) => n.id)}
									strategy={rectSortingStrategy}
								>
									<div
										className={
											isListView ? 'd-flex flex-column gap-2' : masonryGrid
										}
									>
										{pinnedNotes.map((note) => (
											<NoteCard
												key={note.id}
												note={note}
												{...noteCardProps}
												onTogglePin={() => handleTogglePin(note.id)}
												onDelete={() => handleDelete(note.id)}
												onToggleCheck={(checkId) =>
													handleToggleCheck(note.id, checkId)
												}
												onColorChange={(color) =>
													handleColorChange(note.id, color)
												}
												onLabelRemove={(label) =>
													handleRemoveLabel(note.id, label)
												}
												onLabelAdd={(label) =>
													handleAddLabelToNote(note.id, label)
												}
											/>
										))}
									</div>
								</SortableContext>
							</>
						)}

						{otherNotes.length > 0 && (
							<>
								{pinnedNotes.length > 0 && (
									<h6
										className='text-muted text-uppercase mb-2 mt-3'
										style={{ fontSize: '0.7rem', letterSpacing: 1 }}
									>
										Otras
									</h6>
								)}
								<SortableContext
									items={otherNotes.map((n) => n.id)}
									strategy={rectSortingStrategy}
								>
									<div
										className={
											isListView ? 'd-flex flex-column gap-2' : masonryGrid
										}
									>
										{otherNotes.map((note) => (
											<NoteCard
												key={note.id}
												note={note}
												{...noteCardProps}
												onTogglePin={() => handleTogglePin(note.id)}
												onDelete={() => handleDelete(note.id)}
												onToggleCheck={(checkId) =>
													handleToggleCheck(note.id, checkId)
												}
												onColorChange={(color) =>
													handleColorChange(note.id, color)
												}
												onLabelRemove={(label) =>
													handleRemoveLabel(note.id, label)
												}
												onLabelAdd={(label) =>
													handleAddLabelToNote(note.id, label)
												}
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
