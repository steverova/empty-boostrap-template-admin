import type { ReactNode } from 'react'

export type KeepColor =
	| 'default'
	| 'red'
	| 'orange'
	| 'yellow'
	| 'green'
	| 'cyan'
	| 'blue'
	| 'purple'
	| 'pink'

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

export const COLOR_BOOTSTRAP_MAP: Record<KeepColor, string> = {
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

export const COLOR_DOT_MAP: Record<KeepColor, string> = {
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

export const COLOR_LABELS: Record<KeepColor, string> = {
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

export interface NoteAction {
	label: string
	onClick: () => void
	icon: ReactNode
	title?: string
}

export function extractAllLabels(notes: KeepNote[]): string[] {
	const labelSet = new Set<string>()
	for (const note of notes) {
		note.labels?.forEach((l) => labelSet.add(l))
	}
	return Array.from(labelSet).sort()
}
