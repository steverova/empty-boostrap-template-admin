import { Avatar } from '@/components/shared/avatar'
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
			className={`d-flex align-items-center gap-3 px-3 py-2 border-bottom ${isActive ? 'bg-primary-subtle' : ''}`}
			style={{
				cursor: 'pointer',
				transition: 'background-color 0.15s ease',
				...(isActive && { borderLeft: '3px solid var(--bs-primary)', paddingLeft: 9 }),
			}}
			onClick={() => onSelect(contact.id)}
		>
			<Avatar
				seed={contact.id}
				variant='emoji'
				name={contact.name}
				size='md'
				status={contact.status}
			/>
			<div className='flex-grow-1 min-width-0'>
				<div className='d-flex justify-content-between align-items-baseline mb-1'>
					<span className='fw-semibold text-truncate me-2' style={{ fontSize: '0.9rem' }}>
						{contact.name}
					</span>
					{contact.lastMessageTime && (
						<small className='text-secondary text-nowrap flex-shrink-0' style={{ fontSize: '0.65rem' }}>
							{formatMessageTime(contact.lastMessageTime)}
						</small>
					)}
				</div>
				<div className='d-flex justify-content-between align-items-center'>
					<span className='text-secondary text-truncate me-2' style={{ fontSize: '0.8rem' }}>
						{contact.lastMessage || 'Sin mensajes'}
					</span>
					{contact.unreadCount && contact.unreadCount > 0 && (
						<span
							className='badge bg-primary rounded-pill flex-shrink-0'
							style={{ fontSize: '0.65rem', minWidth: 20 }}
						>
							{contact.unreadCount}
						</span>
					)}
				</div>
			</div>
		</li>
	)
}
