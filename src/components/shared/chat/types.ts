export type MessageStatus = 'sent' | 'delivered' | 'read'

export type ContactStatus = 'online' | 'offline' | 'away' | 'busy'

export type AttachmentType = 'image' | 'video' | 'document'

export interface ChatAttachment {
	url: string
	type: AttachmentType
	name: string
	size?: number
}

export interface ChatMessage {
	id: string
	senderId: string
	text: string
	timestamp: Date
	status?: MessageStatus
	attachment?: ChatAttachment
}

export interface ChatContact {
	id: string
	name: string
	status: ContactStatus
	lastMessage?: string
	lastMessageTime?: Date
	unreadCount?: number
}

export interface ChatProps {
	contacts: ChatContact[]
	messages: ChatMessage[]
	currentUserId: string
	selectedContactId?: string
	typingContactId?: string
	onSelectContact?: (contactId: string) => void
	onSendMessage?: (text: string, attachment?: ChatAttachment) => void
	onBack?: () => void
	className?: string
}