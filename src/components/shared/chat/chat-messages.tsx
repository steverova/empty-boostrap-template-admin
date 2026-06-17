import { useEffect, useRef } from 'react'
import { chatMessages, dateSeparator } from './chat.css'
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
		<div className={chatMessages}>
			{messageGroups.map((group, gi) => (
				<div key={gi}>
					<div className={dateSeparator}>
						{formatDateLabel(group[0]!.timestamp)}
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
