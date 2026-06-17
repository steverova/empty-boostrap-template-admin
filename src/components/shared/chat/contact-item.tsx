import { Avatar } from '@/components/shared/avatar'
import {
	contactInfo,
	contactItem,
	contactItemActive,
	contactLastMessage,
	contactName,
	contactTime,
	unreadBadge,
} from './chat.css'
import { formatMessageTime } from './chat.helper'
import type { ChatContact } from './types'

interface ContactItemProps {
	contact: ChatContact
	isActive: boolean
	onSelect: (contactId: string) => void
}

export function ContactItem({ contact, isActive, onSelect }: ContactItemProps) {
	return (
		<li
			className={isActive ? contactItemActive : contactItem}
			onClick={() => onSelect(contact.id)}
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
	)
}
