import type { AttachmentType, ChatMessage, ContactStatus } from './types'

export function formatMessageTime(date: Date): string {
	return date.toLocaleTimeString('es-ES', {
		hour: '2-digit',
		minute: '2-digit',
	})
}

export function formatDateLabel(date: Date): string {
	const today = new Date()
	const yesterday = new Date(today)
	yesterday.setDate(yesterday.getDate() - 1)

	if (date.toDateString() === today.toDateString()) return 'Hoy'
	if (date.toDateString() === yesterday.toDateString()) return 'Ayer'

	return date.toLocaleDateString('es-ES', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
	})
}

const statusDotBase = 'rounded-circle flex-shrink-0'

const statusDotStyles: Record<ContactStatus, string> = {
	online: `${statusDotBase} bg-success`,
	away: `${statusDotBase} bg-warning`,
	busy: `${statusDotBase} bg-danger`,
	offline: `${statusDotBase} bg-secondary`,
}

export function getStatusDotClass(status: ContactStatus): string {
	return statusDotStyles[status] ?? statusDotStyles.offline
}

export function getStatusLabel(status: ContactStatus): string {
	switch (status) {
		case 'online':
			return 'En línea'
		case 'away':
			return 'Ausente'
		case 'busy':
			return 'Ocupado'
		default:
			return 'Desconectado'
	}
}

export function groupMessagesByDate(messages: ChatMessage[]): ChatMessage[][] {
	const groups: ChatMessage[][] = []
	let currentDate = ''

	for (const msg of messages) {
		const dateStr = msg.timestamp.toDateString()
		if (dateStr !== currentDate) {
			currentDate = dateStr
			groups.push([msg])
		} else {
			groups[groups.length - 1]!.push(msg)
		}
	}

	return groups
}

export function getAttachmentType(file: File): AttachmentType {
	if (file.type.startsWith('image/')) return 'image'
	if (file.type.startsWith('video/')) return 'video'
	return 'document'
}

export function formatFileSize(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`
	if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
	return `${(bytes / 1048576).toFixed(1)} MB`
}
