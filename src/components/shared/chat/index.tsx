import { useCallback, useMemo } from 'react'
import { chatContainer, chatLayout } from './chat.css'
import { ChatFooter } from './chat-footer'
import { ChatHeader } from './chat-header'
import { ChatMessages } from './chat-messages'
import { ChatSidebar } from './chat-sidebar'
import { EmptyChat } from './empty-chat'
import type { ChatAttachment, ChatContact, ChatMessage } from './types'
import { TypingIndicator } from './typing-indicator'

interface ChatProps {
	contacts: ChatContact[]
	messages: Record<string, ChatMessage[]>
	currentUserId: string
	selectedContactId?: string
	typingContactId?: string
	onSelectContact: (contactId: string) => void
	onSendMessage: (text: string, attachment?: ChatAttachment) => void
	onBack?: () => void
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

	const isMobile = useMemo(
		() => typeof window !== 'undefined' && window.innerWidth < 768,
		[],
	)

	const handleBack = useCallback(() => {
		onBack?.()
	}, [onBack])

	return (
		<div className={`${chatContainer} ${className ?? ''}`}>
			{!(isMobile && selectedContactId) && (
				<ChatSidebar
					contacts={contacts}
					selectedContactId={selectedContactId}
					onSelectContact={onSelectContact}
				/>
			)}

			<div className={chatLayout}>
				{selectedContact ? (
					<>
						<ChatHeader
							contact={selectedContact}
							isMobile={isMobile}
							onBack={handleBack}
						/>
						<ChatMessages
							messages={currentMessages}
							currentUserId={currentUserId}
						/>
						{typingContact && <TypingIndicator name={typingContact.name} />}
						<ChatFooter onSendMessage={onSendMessage} />
					</>
				) : selectedContactId ? (
					<EmptyChat />
				) : null}
			</div>
		</div>
	)
}
