import { FileText, Paperclip, Send } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { Avatar } from '@/components/shared/avatar'
import {
	attachmentDocIcon,
	attachmentDocInfo,
	attachmentDocName,
	attachmentDocSize,
	attachmentDocument,
	attachmentImage,
	attachmentPreview,
	attachmentVideo,
	chatContainer,
	chatHeader,
	chatHeaderInfo,
	chatHeaderName,
	chatHeaderStatus,
	chatInput,
	chatInputArea,
	chatLayout,
	chatMessages,
	chatSendButton,
	chatSidebar,
	contactInfo,
	contactItem,
	contactItemActive,
	contactLastMessage,
	contactName,
	contactsList,
	contactTime,
	dateSeparator,
	emptyChat,
	messageBubbleReceived,
	messageBubbleSent,
	messageRowReceived,
	messageRowSent,
	messageTimeReceived,
	messageTimeSent,
	statusDotAway,
	statusDotBusy,
	statusDotOffline,
	statusDotOnline,
	typingDot,
	typingDots,
	typingIndicator,
	unreadBadge,
} from './chat.css'

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
	className?: string
}

function formatMessageTime(date: Date): string {
	return date.toLocaleTimeString('es-ES', {
		hour: '2-digit',
		minute: '2-digit',
	})
}

function formatDateLabel(date: Date): string {
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

function getStatusDotClass(status: ContactStatus): string {
	switch (status) {
		case 'online':
			return statusDotOnline
		case 'away':
			return statusDotAway
		case 'busy':
			return statusDotBusy
		default:
			return statusDotOffline
	}
}

function getStatusLabel(status: ContactStatus): string {
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

function groupMessagesByDate(messages: ChatMessage[]): ChatMessage[][] {
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

function getAttachmentType(file: File): AttachmentType {
	if (file.type.startsWith('image/')) return 'image'
	if (file.type.startsWith('video/')) return 'video'
	return 'document'
}

function formatFileSize(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`
	if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
	return `${(bytes / 1048576).toFixed(1)} MB`
}

function AttachmentRenderer({ attachment }: { attachment: ChatAttachment }) {
	if (attachment.type === 'image') {
		return (
			<div className={attachmentPreview}>
				<img
					src={attachment.url}
					alt={attachment.name}
					className={attachmentImage}
				/>
			</div>
		)
	}

	if (attachment.type === 'video') {
		return (
			<div className={attachmentPreview}>
				<video src={attachment.url} controls className={attachmentVideo} />
			</div>
		)
	}

	return (
		<a
			href={attachment.url}
			target='_blank'
			rel='noopener noreferrer'
			className={attachmentDocument}
		>
			<FileText size={24} className={attachmentDocIcon} />
			<div className={attachmentDocInfo}>
				<span className={attachmentDocName}>{attachment.name}</span>
				{attachment.size != null && (
					<span className={attachmentDocSize}>
						{formatFileSize(attachment.size)}
					</span>
				)}
			</div>
		</a>
	)
}

function TypingIndicator({ name }: { name: string }) {
	return (
		<div className={typingIndicator}>
			<span>{name} está escribiendo</span>
			<span className={typingDots}>
				<span className={typingDot} />
				<span className={typingDot} />
				<span className={typingDot} />
			</span>
		</div>
	)
}

export default function Chat({
	contacts,
	messages,
	currentUserId,
	selectedContactId,
	typingContactId,
	onSelectContact,
	onSendMessage,
	className,
}: ChatProps) {
	const [inputText, setInputText] = useState('')
	const [pendingAttachment, setPendingAttachment] =
		useState<ChatAttachment | null>(null)
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const selectedContact = contacts.find((c) => c.id === selectedContactId)

	const scrollToBottom = useCallback(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [])

	useEffect(() => {
		scrollToBottom()
	}, [messages.length, scrollToBottom])

	const handleSend = useCallback(() => {
		const text = inputText.trim()
		if (!text && !pendingAttachment) return
		onSendMessage?.(text, pendingAttachment ?? undefined)
		setInputText('')
		setPendingAttachment(null)
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto'
		}
	}, [inputText, pendingAttachment, onSendMessage])

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
			if (e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault()
				handleSend()
			}
		},
		[handleSend],
	)

	const handleInput = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			setInputText(e.target.value)
			const el = e.target
			el.style.height = 'auto'
			el.style.height = `${Math.min(el.scrollHeight, 120)}px`
		},
		[],
	)

	const handleFileChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0]
			if (!file) return

			const url = URL.createObjectURL(file)
			setPendingAttachment({
				url,
				type: getAttachmentType(file),
				name: file.name,
				size: file.size,
			})

			e.target.value = ''
		},
		[],
	)

	const handleRemoveAttachment = useCallback(() => {
		if (pendingAttachment?.url.startsWith('blob:')) {
			URL.revokeObjectURL(pendingAttachment.url)
		}
		setPendingAttachment(null)
	}, [pendingAttachment])

	const messageGroups = groupMessagesByDate(messages)
	const typingContact = typingContactId
		? contacts.find((c) => c.id === typingContactId)
		: null

	return (
		<div className={`${chatContainer} ${className ?? ''}`}>
			<div className={chatSidebar}>
				<ul className={contactsList}>
					{contacts.map((contact) => (
						<li
							key={contact.id}
							className={
								contact.id === selectedContactId
									? contactItemActive
									: contactItem
							}
							onClick={() => onSelectContact?.(contact.id)}
						>
							<Avatar
								seed={contact.id}
								variant='emoji'
								name={contact.name}
								size='md'
								status={contact.status}
							/>
							<div className={contactInfo}>
								<div className={contactName}>{contact.name}</div>
								<div className={contactLastMessage}>
									{contact.lastMessage || 'Sin mensajes'}
								</div>
							</div>
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'flex-end',
									gap: 4,
								}}
							>
								{contact.lastMessageTime && (
									<span className={contactTime}>
										{formatMessageTime(contact.lastMessageTime)}
									</span>
								)}
								{contact.unreadCount && contact.unreadCount > 0 && (
									<span className={unreadBadge}>{contact.unreadCount}</span>
								)}
							</div>
						</li>
					))}
				</ul>
			</div>

			<div className={chatLayout}>
				{selectedContact ? (
					<>
						<div className={chatHeader}>
							<Avatar
								seed={selectedContact.id}
								variant='emoji'
								name={selectedContact.name}
								size='md'
								status={selectedContact.status}
							/>
							<div className={chatHeaderInfo}>
								<div className={chatHeaderName}>{selectedContact.name}</div>
								<div className={chatHeaderStatus}>
									<span className={getStatusDotClass(selectedContact.status)} />
									{getStatusLabel(selectedContact.status)}
								</div>
							</div>
						</div>

						<div className={chatMessages}>
							{messageGroups.map((group, gi) => (
								<div key={gi}>
									<div className={dateSeparator}>
										{formatDateLabel(group[0]!.timestamp)}
									</div>
									{group.map((msg) => {
										const isSent = msg.senderId === currentUserId
										return (
											<div
												key={msg.id}
												className={isSent ? messageRowSent : messageRowReceived}
											>
												{!isSent && (
													<Avatar
														seed={msg.senderId}
														variant='emoji'
														size='xs'
													/>
												)}
												<div>
													<div
														className={
															isSent ? messageBubbleSent : messageBubbleReceived
														}
													>
														{msg.attachment && (
															<AttachmentRenderer attachment={msg.attachment} />
														)}
														{msg.text && <span>{msg.text}</span>}
													</div>
													<div
														className={
															isSent ? messageTimeSent : messageTimeReceived
														}
													>
														{formatMessageTime(msg.timestamp)}
													</div>
												</div>
											</div>
										)
									})}
								</div>
							))}
							<div ref={messagesEndRef} />
						</div>

						{typingContact && <TypingIndicator name={typingContact.name} />}

						{pendingAttachment && (
							<div className='d-flex align-items-center gap-2 px-3 py-2 border-top bg-body'>
								<AttachmentRenderer attachment={pendingAttachment} />
								<Button
									variant='outline-danger'
									size='sm'
									onClick={handleRemoveAttachment}
								>
									×
								</Button>
							</div>
						)}

						<div className={chatInputArea}>
							<input
								ref={fileInputRef}
								type='file'
								accept='image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip'
								style={{ display: 'none' }}
								onChange={handleFileChange}
							/>
							<Button
								variant='outline-secondary'
								size='sm'
								onClick={() => fileInputRef.current?.click()}
								style={{
									borderRadius: '50%',
									width: 36,
									height: 36,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								<Paperclip size={16} />
							</Button>
							<Form.Control
								ref={textareaRef}
								as='textarea'
								rows={1}
								className={chatInput}
								placeholder='Escribe un mensaje...'
								value={inputText}
								onChange={handleInput}
								onKeyDown={handleKeyDown}
							/>
							<Button
								variant='primary'
								className={chatSendButton}
								onClick={handleSend}
								disabled={!inputText.trim() && !pendingAttachment}
							>
								<Send size={16} />
							</Button>
						</div>
					</>
				) : (
					<div className={emptyChat}>
						<Send size={48} strokeWidth={1} />
						<h5 className='mb-0'>Selecciona una conversación</h5>
						<p className='text-center mb-0'>
							Elige un contacto de la lista para comenzar a chatear
						</p>
					</div>
				)}
			</div>
		</div>
	)
}
