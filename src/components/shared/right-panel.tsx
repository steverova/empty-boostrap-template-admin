import { Cloud, MessageSquare, Minus, X } from 'lucide-react'
import { useState, useCallback } from 'react'
import { Chat } from '@/components/shared/chat'
import type { ChatContact, ChatMessage } from '@/components/shared/chat/types'
import IconButton from '@/components/shared/icon-button'

interface RightPanelProps {
	onClose: () => void
}

const contacts: ChatContact[] = [
	{ id: 'c1', name: 'John Doe', status: 'online', lastMessage: 'Nice! Let me know if you need help.', lastMessageTime: new Date(2026, 5, 18, 10, 33), unreadCount: 1 },
	{ id: 'c2', name: 'Jane Smith', status: 'away', lastMessage: 'The meeting is at 3pm.', lastMessageTime: new Date(2026, 5, 18, 9, 15) },
	{ id: 'c3', name: 'Mike Johnson', status: 'offline', lastMessage: 'See you tomorrow!', lastMessageTime: new Date(2026, 5, 17, 18, 0) },
]

const initialMessages: Record<string, ChatMessage[]> = {
	c1: [
		{ id: 'm1', senderId: 'c1', text: 'Hey! How are you?', timestamp: new Date(2026, 5, 18, 10, 30) },
		{ id: 'm2', senderId: 'me', text: "I'm good, thanks! Working on the new feature.", timestamp: new Date(2026, 5, 18, 10, 32) },
		{ id: 'm3', senderId: 'c1', text: 'Nice! Let me know if you need help.', timestamp: new Date(2026, 5, 18, 10, 33) },
	],
	c2: [
		{ id: 'm4', senderId: 'c2', text: 'The meeting is at 3pm.', timestamp: new Date(2026, 5, 18, 9, 15) },
	],
	c3: [
		{ id: 'm5', senderId: 'c3', text: 'See you tomorrow!', timestamp: new Date(2026, 5, 17, 18, 0) },
	],
}

export default function RightPanel({ onClose }: RightPanelProps) {
	const [chatOpen, setChatOpen] = useState(false)
	const [selectedContactId, setSelectedContactId] = useState<string | undefined>()
	const [chatMessages, setChatMessages] = useState(initialMessages)

	const handleSendMessage = useCallback((text: string) => {
		if (!selectedContactId) return
		const newMsg: ChatMessage = {
			id: `m${Date.now()}`,
			senderId: 'me',
			text,
			timestamp: new Date(),
		}
		setChatMessages((prev) => ({
			...prev,
			[selectedContactId]: [...(prev[selectedContactId] ?? []), newMsg],
		}))
	}, [selectedContactId])

	function handleToggleChat() {
		setChatOpen((prev) => !prev)
	}

	return (
		<div
			className='my-2 bg-light-subtle rounded-3 border overflow-hidden d-flex flex-column'
			style={{
				width: chatOpen ? 400 : 56,
				transition: 'width 0.2s ease',
			}}
		>
			{chatOpen ? (
				<>
					<div className='d-flex justify-content-end p-2 flex-shrink-0'>
						<button
							type='button'
							onClick={() => { setChatOpen(false); setSelectedContactId(undefined) }}
							style={{
								width: 28,
								height: 28,
								border: '1px solid var(--bs-border-color)',
								borderRadius: '6px',
								backgroundColor: 'var(--bs-body-bg)',
								cursor: 'pointer',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								padding: 0,
							}}
						>
							<X size={14} style={{ color: 'var(--bs-secondary-color)' }} />
						</button>
					</div>
					<div className='flex-grow-1 min-height-0'>
						<Chat
							contacts={contacts}
							messages={chatMessages}
							currentUserId='me'
							selectedContactId={selectedContactId}
							onSelectContact={setSelectedContactId}
							onSendMessage={handleSendMessage}
							onBack={() => setSelectedContactId(undefined)}
							className='h-100'
							compact
						/>
					</div>
				</>
			) : (
				<div className='d-flex flex-column align-items-center gap-2 p-2 h-100'>
					<button
						type='button'
						onClick={onClose}
						style={{
							width: 28,
							height: 28,
							border: '1px solid var(--bs-border-color)',
							borderRadius: '6px',
							backgroundColor: 'var(--bs-body-bg)',
							cursor: 'pointer',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							padding: 0,
						}}
					>
						<Minus size={14} style={{ color: 'var(--bs-secondary-color)' }} />
					</button>
					<IconButton aria-label='Messages' onClick={handleToggleChat}>
						<MessageSquare size={20} />
					</IconButton>
					<IconButton aria-label='Cloud' onClick={() => {}}>
						<Cloud size={20} />
					</IconButton>
				</div>
			)}
		</div>
	)
}
