import { ArrowLeft } from 'lucide-react'
import { Button } from 'react-bootstrap'
import { Avatar } from '@/components/shared/avatar'
import { getStatusDotClass, getStatusLabel } from './chat.helper'
import type { ChatContact } from './types'

interface ChatHeaderProps {
	contact: ChatContact
	onBack: () => void
}

export function ChatHeader({ contact, onBack }: ChatHeaderProps) {
	return (
		<div className='d-flex align-items-center gap-3 px-3 py-2 border-bottom bg-body flex-shrink-0'>
			<Button
				variant='link'
				onClick={onBack}
				className='p-0 border-0 bg-transparent d-flex d-md-none align-items-center text-decoration-none'
			>
				<ArrowLeft size={24} />
			</Button>
			<Avatar
				seed={contact.id}
				variant='emoji'
				name={contact.name}
				size='md'
				status={contact.status}
			/>
			<div className='d-flex flex-column flex-grow-1 min-width-0'>
				<div className='fw-semibold' style={{ fontSize: '0.95rem', lineHeight: 1.2 }}>
					<span className='text-truncate d-block'>{contact.name}</span>
				</div>
				<div className='d-flex align-items-center gap-1' style={{ fontSize: '0.75rem' }}>
					<span className={getStatusDotClass(contact.status)} />
					<span className='text-secondary'>{getStatusLabel(contact.status)}</span>
				</div>
			</div>
		</div>
	)
}
