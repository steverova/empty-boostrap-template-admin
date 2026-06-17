import { ArrowLeft, FileText, Paperclip, Send } from 'lucide-react'
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
	typingDot,
	typingDots,
	typingIndicator,
	unreadBadge,
} from './chat.css'
import {
	formatDateLabel,
	formatFileSize,
	formatMessageTime,
	getAttachmentType,
	getStatusDotClass,
	getStatusLabel,
	groupMessagesByDate,
} from './chat.helper'
import type { ChatAttachment, ChatProps } from './types'

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
	onBack,
	className,
}: ChatProps) {
	const [inputText, setInputText] = useState('')
	const [pendingAttachment, setPendingAttachment] =
		useState<ChatAttachment | null>(null)
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const selectedContact = selectedContactId
	? contacts.find((c) => c.id === selectedContactId)
	: undefined

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

	const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

	const handleBack = useCallback(() => {
		if (onBack) {
			onBack()
		} else {
			onSelectContact?.(undefined)
		}
	}, [onBack, onSelectContact])

	return (
		<div className={`${chatContainer} ${className ?? ''}`}>
			{isMobile && selectedContactId ? null : (
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
			)}

			<div className={chatLayout}>
				{selectedContact ? (
					<>
						<div className={chatHeader}>
							{isMobile && (
								<Button
									variant='link'
									onClick={handleBack}
									style={{
										padding: 0,
										border: 'none',
										background: 'none',
										display: 'flex',
										alignItems: 'center',
									}}
								>
									<ArrowLeft size={24} />
								</Button>
							)}
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
				) : selectedContactId ? (
					<div className={emptyChat}>
						<Send size={48} strokeWidth={1} />
						<h5 className='mb-0'>Selecciona una conversación</h5>
						<p className='text-center mb-0'>
							Elige un contacto de la lista para comenzar a chatear
						</p>
					</div>
				) : null}
			</div>
		</div>
	)
}
