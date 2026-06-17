import { useEffect, useRef } from 'react'
import { BubbleChatMessage } from './bubble-chat-message'
import { formatDateLabel, groupMessagesByDate } from './chat.helper'
import type { ChatMessage } from './types'

interface ChatMessagesProps {
	messages: ChatMessage[]
	currentUserId: string
}

export function ChatMessages({ messages, currentUserId }: ChatMessagesProps) {
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const messageGroups = groupMessagesByDate(messages)

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages.length])

	return (
		<div className='flex-grow-1 overflow-auto p-3 d-flex flex-column gap-1 w-100' style={{ minHeight: 0 }}>
			{messageGroups.map((group, gi) => (
				<div key={gi}>
					<div className='text-center py-2 d-flex align-items-center gap-3' style={{ fontSize: '0.7rem', color: 'var(--bs-secondary-color)', fontWeight: 500 }}>
						<div className='flex-grow-1' style={{ height: 1, backgroundColor: 'var(--bs-border-color)' }} />
						<span>{formatDateLabel(group[0]!.timestamp)}</span>
						<div className='flex-grow-1' style={{ height: 1, backgroundColor: 'var(--bs-border-color)' }} />
					</div>
					{group.map((msg) => (
						<BubbleChatMessage
							key={msg.id}
							message={msg}
							isSent={msg.senderId === currentUserId}
						/>
					))}
				</div>
			))}
			<div ref={messagesEndRef} />
		</div>
	)
}
