import { ArrowLeft } from 'lucide-react'
import { Button } from 'react-bootstrap'
import { Avatar } from '@/components/shared/avatar'
import {
	chatHeader,
	chatHeaderInfo,
	chatHeaderName,
	chatHeaderStatus,
} from './chat.css'
import { getStatusDotClass, getStatusLabel } from './chat.helper'
import type { ChatContact } from './types'

interface ChatHeaderProps {
	contact: ChatContact
	isMobile: boolean
	onBack: () => void
}

export function ChatHeader({ contact, isMobile, onBack }: ChatHeaderProps) {
	return (
		<div className={chatHeader}>
			{isMobile && (
				<Button
					variant='link'
					onClick={onBack}
					style={{
						padding: 0,
						border: 'none',
						background: 'none',
						display: 'flex',
						alignItems: 'center',
					}}
				>
					<ArrowLeft size={24} />
				</Button>
			)}
			<Avatar
				seed={contact.id}
				variant='emoji'
				name={contact.name}
				size='md'
				status={contact.status}
			/>
			<div className={chatHeaderInfo}>
				<div className={chatHeaderName}>{contact.name}</div>
				<div className={chatHeaderStatus}>
					<span className={getStatusDotClass(contact.status)} />
					{getStatusLabel(contact.status)}
				</div>
			</div>
		</div>
	)
}
