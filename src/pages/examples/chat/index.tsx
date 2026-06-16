import { useCallback, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { MessageSquare } from 'lucide-react'
import Chat, { ContactList, type ChatContact, type ChatMessage } from '@/components/shared/chat'

const CURRENT_USER_ID = 'user-me'

const mockContacts: ChatContact[] = [
	{
		id: 'user-1',
		name: 'María García',
		status: 'online',
		lastMessage: '¡Hola! ¿Cómo estás?',
		lastMessageTime: new Date(2026, 5, 15, 10, 30),
		unreadCount: 2,
	},
	{
		id: 'user-2',
		name: 'Carlos López',
		status: 'away',
		lastMessage: 'Revisé el código, se ve bien 👍',
		lastMessageTime: new Date(2026, 5, 15, 9, 45),
		unreadCount: 0,
	},
	{
		id: 'user-3',
		name: 'Ana Martínez',
		status: 'online',
		lastMessage: '¿Tenemos reunión hoy?',
		lastMessageTime: new Date(2026, 5, 15, 8, 15),
		unreadCount: 1,
	},
	{
		id: 'user-4',
		name: 'Pedro Sánchez',
		status: 'busy',
		lastMessage: 'El deploy está programado para las 5pm',
		lastMessageTime: new Date(2026, 5, 14, 17, 30),
		unreadCount: 0,
	},
	{
		id: 'user-5',
		name: 'Laura Rodríguez',
		status: 'offline',
		lastMessage: 'Gracias por la ayuda!',
		lastMessageTime: new Date(2026, 5, 14, 14, 20),
		unreadCount: 0,
	},
	{
		id: 'user-6',
		name: 'Dev Team',
		status: 'online',
		lastMessage: 'Sprint planning mañana a las 10am',
		lastMessageTime: new Date(2026, 5, 13, 16, 0),
		unreadCount: 5,
	},
]

const mockMessages: Record<string, ChatMessage[]> = {
	'user-1': [
		{ id: 'm1', senderId: 'user-1', text: '¡Hola! ¿Cómo estás?', timestamp: new Date(2026, 5, 15, 10, 28) },
		{ id: 'm2', senderId: 'user-1', text: '¿Terminaste el módulo de reportes?', timestamp: new Date(2026, 5, 15, 10, 30) },
		{ id: 'm3', senderId: CURRENT_USER_ID, text: '¡Hola María! Sí, ya lo terminé. Está en el PR #42', timestamp: new Date(2026, 5, 15, 10, 32) },
		{ id: 'm4', senderId: 'user-1', text: 'Genial, lo reviso ahora mismo', timestamp: new Date(2026, 5, 15, 10, 33) },
		{ id: 'm5', senderId: CURRENT_USER_ID, text: 'Perfecto, avísame si tienes algún comentario 👍', timestamp: new Date(2026, 5, 15, 10, 34) },
		{ id: 'm6', senderId: 'user-1', text: '¡Hola! ¿Cómo estás?', timestamp: new Date(2026, 5, 15, 10, 30) },
	],
	'user-2': [
		{ id: 'm7', senderId: 'user-2', text: '¿Puedes revisar mi PR?', timestamp: new Date(2026, 5, 15, 9, 30) },
		{ id: 'm8', senderId: CURRENT_USER_ID, text: 'Dale, lo miro en un rato', timestamp: new Date(2026, 5, 15, 9, 35) },
		{ id: 'm9', senderId: 'user-2', text: 'Revisé el código, se ve bien 👍', timestamp: new Date(2026, 5, 15, 9, 45) },
	],
	'user-3': [
		{ id: 'm10', senderId: 'user-3', text: '¿Tenemos reunión hoy?', timestamp: new Date(2026, 5, 15, 8, 15) },
		{ id: 'm11', senderId: CURRENT_USER_ID, text: 'Sí, a las 2pm en la sala de juntas', timestamp: new Date(2026, 5, 15, 8, 20) },
		{ id: 'm12', senderId: 'user-3', text: 'Perfecto, gracias!', timestamp: new Date(2026, 5, 15, 8, 21) },
	],
	'user-4': [
		{ id: 'm13', senderId: 'user-4', text: 'El deploy está programado para las 5pm', timestamp: new Date(2026, 5, 14, 17, 30) },
		{ id: 'm14', senderId: CURRENT_USER_ID, text: 'Ok, ya estoy preparando el changelog', timestamp: new Date(2026, 5, 14, 17, 35) },
	],
	'user-5': [
		{ id: 'm15', senderId: CURRENT_USER_ID, text: '¿Necesitas ayuda con el bug del login?', timestamp: new Date(2026, 5, 14, 14, 15) },
		{ id: 'm16', senderId: 'user-5', text: 'Gracias por la ayuda!', timestamp: new Date(2026, 5, 14, 14, 20) },
	],
	'user-6': [
		{ id: 'm17', senderId: 'user-4', text: 'Sprint planning mañana a las 10am', timestamp: new Date(2026, 5, 13, 16, 0) },
		{ id: 'm18', senderId: 'user-2', text: 'Anotado!', timestamp: new Date(2026, 5, 13, 16, 5) },
		{ id: 'm19', senderId: CURRENT_USER_ID, text: 'Yo estaré ahí', timestamp: new Date(2026, 5, 13, 16, 10) },
	],
}

export default function ChatExamplePage() {
	const [selectedContactId, setSelectedContactId] = useState<string>('user-1')
	const [allMessages, setAllMessages] = useState<Record<string, ChatMessage[]>>(mockMessages)
	const [contacts, setContacts] = useState<ChatContact[]>(mockContacts)
	const [typingContactId, setTypingContactId] = useState<string | undefined>()

	const handleSelectContact = useCallback((contactId: string) => {
		setSelectedContactId(contactId)
		setContacts((prev) =>
			prev.map((c) =>
				c.id === contactId ? { ...c, unreadCount: 0 } : c,
			),
		)
	}, [])

	const handleSendMessage = useCallback(
		(text: string) => {
			if (!selectedContactId) return

			const newMsg: ChatMessage = {
				id: `m-${Date.now()}`,
				senderId: CURRENT_USER_ID,
				text,
				timestamp: new Date(),
				status: 'sent',
			}

			setAllMessages((prev) => ({
				...prev,
				[selectedContactId]: [...(prev[selectedContactId] ?? []), newMsg],
			}))

			setContacts((prev) =>
				prev.map((c) =>
					c.id === selectedContactId
						? { ...c, lastMessage: text, lastMessageTime: new Date() }
						: c,
				),
			)

			if (selectedContactId !== 'user-6') {
				setTypingContactId(selectedContactId)
				const typingContact = contacts.find((c) => c.id === selectedContactId)
				setTimeout(() => {
					setTypingContactId(undefined)
					const replyMsg: ChatMessage = {
						id: `m-reply-${Date.now()}`,
						senderId: selectedContactId,
						text: getAutoReply(typingContact?.name ?? ''),
						timestamp: new Date(),
					}
					setAllMessages((prev) => ({
						...prev,
						[selectedContactId]: [...(prev[selectedContactId] ?? []), replyMsg],
					}))
					setContacts((prev) =>
						prev.map((c) =>
							c.id === selectedContactId
								? { ...c, lastMessage: replyMsg.text, lastMessageTime: new Date() }
								: c,
						),
					)
				}, 1500 + Math.random() * 1000)
			}
		},
		[selectedContactId, contacts],
	)

	const currentMessages = allMessages[selectedContactId] ?? []

	return (
		<Container fluid className='py-3 px-3 px-md-4' style={{ height: '100%' }}>
			<div className='mb-3 d-flex align-items-center gap-2'>
				<MessageSquare size={20} />
				<h4 className='mb-0'>Chat</h4>
			</div>

			<Row className='g-0 bg-body shadow-sm' style={{ height: 'calc(100vh - 180px)', minHeight: 400, borderRadius: 'var(--bs-border-radius)', overflow: 'hidden', border: '1px solid var(--bs-border-color)' }}>
				<Col xs={12} md={4} lg={3} className='border-end' style={{ overflowY: 'auto' }}>
					<ContactList
						contacts={contacts}
						selectedContactId={selectedContactId}
						onSelectContact={handleSelectContact}
					/>
				</Col>
				<Col xs={12} md={8} lg={9} style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
					<Chat
						contacts={contacts}
						messages={currentMessages}
						currentUserId={CURRENT_USER_ID}
						selectedContactId={selectedContactId}
						typingContactId={typingContactId}
						onSendMessage={handleSendMessage}
					/>
				</Col>
			</Row>
		</Container>
	)
}

function getAutoReply(_name: string): string {
	const replies = [
		'¡Entendido! 👍',
		'Dale, lo miro ahora',
		'Perfecto, gracias!',
		'Sí, estoy de acuerdo',
		'Lo reviso y te aviso',
		'Genial!',
		'Ok, en un momento',
		'Buen punto, lo tenemos en cuenta',
	]
	const idx = Math.floor(Math.random() * replies.length)
	return replies[idx]!
}
