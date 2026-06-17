import { Avatar } from '@/components/shared/avatar'
import { AttachmentRenderer } from './attachment-renderer'
import { formatMessageTime } from './chat.helper'
import type { ChatMessage } from './types'

interface BubbleChatMessageProps {
	message: ChatMessage
	isSent: boolean
}

export function BubbleChatMessage({ message, isSent }: BubbleChatMessageProps) {
	return (
		<div
			className={`d-flex align-items-end gap-2 mb-1 ${isSent ? 'align-self-end flex-row-reverse' : 'align-self-start'}`}
			style={{ maxWidth: '75%' }}
		>
			{!isSent && (
				<Avatar
					seed={message.senderId}
					variant='emoji'
					size='xs'
				/>
			)}
			<div>
				<div
					className={`px-3 py-2 rounded-4 position-relative ${isSent ? 'bg-primary text-white' : 'bg-body-tertiary text-body'}`}
					style={{ fontSize: '0.875rem', lineHeight: 1.4, wordBreak: 'break-word', borderBottomRightRadius: isSent ? 4 : undefined, borderBottomLeftRadius: !isSent ? 4 : undefined }}
				>
					{message.attachment && (
						<AttachmentRenderer attachment={message.attachment} />
					)}
					{message.text && <span>{message.text}</span>}
				</div>
				<div
					className={`${isSent ? 'text-end' : 'text-start'}`}
					style={{ fontSize: '0.65rem', color: 'var(--bs-secondary-color)', marginTop: 2, whiteSpace: 'nowrap' }}
				>
					{formatMessageTime(message.timestamp)}
				</div>
			</div>
		</div>
	)
}
