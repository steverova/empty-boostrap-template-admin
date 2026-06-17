import { useCallback, useMemo } from 'react'
import { ChatFooter } from './chat-footer'
import { ChatHeader } from './chat-header'
import { ChatMessages } from './chat-messages'
import { ChatSidebar } from './chat-sidebar'
import { EmptyChat } from './empty-chat'
import { TypingIndicator } from './typing-indicator'
import type { ChatAttachment, ChatContact, ChatMessage } from './types'

interface ChatProps {
	contacts: ChatContact[]
	messages: Record<string, ChatMessage[]>
	currentUserId: string
	selectedContactId?: string
	typingContactId?: string
	onSelectContact: (contactId: string) => void
	onSendMessage: (text: string, attachment?: ChatAttachment) => void
	onBack?: () => void
	onNewChat?: () => void
	className?: string
}

export function Chat({
	contacts,
	messages,
	currentUserId,
	selectedContactId,
	typingContactId,
	onSelectContact,
	onSendMessage,
	onBack,
	onNewChat,
	className,
}: ChatProps) {
	const selectedContact = useMemo(
		() => contacts.find((c) => c.id === selectedContactId),
		[contacts, selectedContactId],
	)

	const currentMessages = useMemo(
		() => (selectedContactId ? messages[selectedContactId] ?? [] : []),
		[messages, selectedContactId],
	)

	const typingContact = useMemo(
		() =>
			typingContactId ? contacts.find((c) => c.id === typingContactId) : null,
		[contacts, typingContactId],
	)

	const handleBack = useCallback(() => {
		onBack?.()
	}, [onBack])

	return (
		<div
			className={`d-flex flex-column flex-md-row h-100 border rounded bg-body overflow-hidden ${className ?? ''}`}
		>
			{/* Mobile: show sidebar OR chat */}
			<div className='d-flex d-md-none flex-column h-100 w-100' style={{ flex: '1 1 0%' }}>
				{selectedContact ? (
					<div className='d-flex flex-column flex-grow-1 h-100 min-width-0 w-100'>
						<ChatHeader contact={selectedContact} onBack={handleBack} />
						<ChatMessages messages={currentMessages} currentUserId={currentUserId} />
						{typingContact && <TypingIndicator name={typingContact.name} />}
						<ChatFooter onSendMessage={onSendMessage} />
					</div>
				) : (
					<ChatSidebar
						contacts={contacts}
						selectedContactId={selectedContactId}
						onSelectContact={onSelectContact}
						onNewChat={onNewChat}
					/>
				)}
			</div>

			{/* Desktop: sidebar + chat side by side */}
			<div className='d-none d-md-flex flex-row h-100 flex-grow-1'>
				<ChatSidebar
					contacts={contacts}
					selectedContactId={selectedContactId}
					onSelectContact={onSelectContact}
					onNewChat={onNewChat}
				/>
				<div className='d-flex flex-column flex-grow-1 h-100 min-width-0 overflow-hidden'>
					{selectedContact ? (
						<>
							<ChatHeader contact={selectedContact} onBack={handleBack} />
							<ChatMessages messages={currentMessages} currentUserId={currentUserId} />
							{typingContact && <TypingIndicator name={typingContact.name} />}
							<ChatFooter onSendMessage={onSendMessage} />
						</>
					) : (
						<EmptyChat />
					)}
				</div>
			</div>
		</div>
	)
}
