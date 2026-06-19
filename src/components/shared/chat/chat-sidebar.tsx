import { MessageSquarePlus, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Form, InputGroup } from 'react-bootstrap'
import { ContactItem } from './contact-item'
import type { ChatContact } from './types'

interface ChatSidebarProps {
	contacts: ChatContact[]
	selectedContactId?: string
	onSelectContact: (contactId: string) => void
	onNewChat?: () => void
	compact?: boolean
}

export function ChatSidebar({
	contacts,
	selectedContactId,
	onSelectContact,
	onNewChat,
	compact,
}: ChatSidebarProps) {
	const [query, setQuery] = useState('')

	const filteredContacts = useMemo(() => {
		if (!query.trim()) return contacts
		const q = query.toLowerCase()
		return contacts.filter((c) => c.name.toLowerCase().includes(q))
	}, [contacts, query])

	return (
		<div
			className='chat-sidebar d-flex flex-column h-100 bg-body border-end'
			style={compact ? { width: '100%', minWidth: 0, border: 'none' } : undefined}
		>
			<div className='p-3 d-flex flex-column gap-2 flex-shrink-0'>
				{onNewChat && (
					<button
						type='button'
						className='btn btn-primary d-flex align-items-center justify-content-center gap-2'
						onClick={onNewChat}
					>
						<MessageSquarePlus size={18} />
						New Chat
					</button>
				)}
				<InputGroup>
					<InputGroup.Text className='bg-body border-end-0'>
						<Search size={16} className='text-secondary' />
					</InputGroup.Text>
					<Form.Control
						type='text'
						placeholder='Buscar contacto...'
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						className='border-start-0'
						style={{ fontSize: '0.875rem' }}
					/>
				</InputGroup>
			</div>

			<div className='flex-grow-1 overflow-auto'>
				<ul className='list-unstyled mb-0'>
					{filteredContacts.map((contact) => (
						<ContactItem
							key={contact.id}
							contact={contact}
							isActive={contact.id === selectedContactId}
							onSelect={onSelectContact}
						/>
					))}
				</ul>
			</div>
		</div>
	)
}
