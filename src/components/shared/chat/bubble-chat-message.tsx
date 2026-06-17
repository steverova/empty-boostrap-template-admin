import { Avatar } from '@/components/shared/avatar'
import {
	messageBubbleReceived,
	messageBubbleSent,
	messageRowReceived,
	messageRowSent,
	messageTimeReceived,
	messageTimeSent,
} from './chat.css'
import { AttachmentRenderer } from './attachment-renderer'
import { formatMessageTime } from './chat.helper'
import type { ChatMessage } from './types'

interface BubbleChatMessageProps {
	message: ChatMessage
	isSent: boolean
}

export function BubbleChatMessage({ message, isSent }: BubbleChatMessageProps) {
	return (
		<div className={isSent ? messageRowSent : messageRowReceived}>
			{!isSent && (
				<Avatar
					seed={message.senderId}
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
					{message.attachment && (
						<AttachmentRenderer attachment={message.attachment} />
					)}
					{message.text && <span>{message.text}</span>}
				</div>
				<div
					className={
						isSent ? messageTimeSent : messageTimeReceived
					}
				>
					{formatMessageTime(message.timestamp)}
				</div>
			</div>
		</div>
	)
}
