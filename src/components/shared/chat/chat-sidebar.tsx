import { chatSidebar, contactsList } from './chat.css'
import { ContactItem } from './contact-item'
import type { ChatContact } from './types'

interface ChatSidebarProps {
	contacts: ChatContact[]
	selectedContactId?: string
	onSelectContact: (contactId: string) => void
}

export function ChatSidebar({
	contacts,
	selectedContactId,
	onSelectContact,
}: ChatSidebarProps) {
	return (
		<div className={chatSidebar}>
			<ul className={contactsList}>
				{contacts.map((contact) => (
					<ContactItem
						key={contact.id}
						contact={contact}
						isActive={contact.id === selectedContactId}
						onSelect={onSelectContact}
					/>
				))}
			</ul>
		</div>
	)
}
