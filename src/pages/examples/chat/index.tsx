import { nanoid } from 'nanoid'
import { useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Chat } from '@/components/shared/chat'
import type {
	ChatAttachment,
	ChatContact,
	ChatMessage,
} from '@/components/shared/chat/types'

const CURRENT_USER_ID = 'user-me'

function generateMockData() {
	const contacts: ChatContact[] = [
		{
			id: nanoid(),
			name: 'María García',
			status: 'online',
			lastMessage: '¡Hola! ¿Cómo estás?',
			lastMessageTime: new Date(2026, 5, 15, 10, 30),
			unreadCount: 2,
		},
		{
			id: nanoid(),
			name: 'Carlos López',
			status: 'away',
			lastMessage: 'Revisé el código, se ve bien 👍',
			lastMessageTime: new Date(2026, 5, 15, 9, 45),
			unreadCount: 0,
		},
		{
			id: nanoid(),
			name: 'Ana Martínez',
			status: 'online',
			lastMessage: '¿Tenemos reunión hoy?',
			lastMessageTime: new Date(2026, 5, 15, 8, 15),
			unreadCount: 1,
		},
		{
			id: nanoid(),
			name: 'Pedro Sánchez',
			status: 'busy',
			lastMessage: 'El deploy está programado para las 5pm',
			lastMessageTime: new Date(2026, 5, 14, 17, 30),
			unreadCount: 0,
		},
		{
			id: nanoid(),
			name: 'Laura Rodríguez',
			status: 'offline',
			lastMessage: 'Gracias por la ayuda!',
			lastMessageTime: new Date(2026, 5, 14, 14, 20),
			unreadCount: 0,
		},
		{
			id: nanoid(),
			name: 'Dev Team',
			status: 'online',
			lastMessage: 'Sprint planning mañana a las 10am',
			lastMessageTime: new Date(2026, 5, 13, 16, 0),
			unreadCount: 5,
		},
	]

	const [maria, carlos, ana, pedro, laura, dev] = contacts

	const messages: Record<string, ChatMessage[]> = {
		[maria.id]: [
			{
				id: nanoid(),
				senderId: maria.id,
				text: '¡Hola! ¿Cómo estás?',
				timestamp: new Date(2026, 5, 15, 9, 0),
			},
			{
				id: nanoid(),
				senderId: CURRENT_USER_ID,
				text: '¡Hola María! Bien, aquí trabajando en el sprint',
				timestamp: new Date(2026, 5, 15, 9, 2),
			},
			{
				id: nanoid(),
				senderId: maria.id,
				text: '¿Terminaste el módulo de reportes?',
				timestamp: new Date(2026, 5, 15, 9, 5),
			},
			{
				id: nanoid(),
				senderId: CURRENT_USER_ID,
				text: 'Sí, ya lo terminé. Está en el PR #42',
				timestamp: new Date(2026, 5, 15, 9, 7),
			},
			{
				id: nanoid(),
				senderId: maria.id,
				text: 'Genial, lo reviso ahora mismo',
				timestamp: new Date(2026, 5, 15, 9, 8),
			},
			{
				id: nanoid(),
				senderId: maria.id,
				text: 'Una pregunta, ¿por qué usaste useState en vez de useReducer para el formulario?',
				timestamp: new Date(2026, 5, 15, 9, 15),
			},
			{
				id: nanoid(),
				senderId: CURRENT_USER_ID,
				text: 'Buen punto. Al principio eran pocos campos pero ahora creció. Podría refactorizarse',
				timestamp: new Date(2026, 5, 15, 9, 18),
			},
			{
				id: nanoid(),
				senderId: maria.id,
				text: 'Sí, yo haría un useReducer con un action type por campo. Más limpio para manejar validaciones',
				timestamp: new Date(2026, 5, 15, 9, 20),
			},
			{
				id: nanoid(),
				senderId: CURRENT_USER_ID,
				text: 'Tienes razón, lo cambio antes de mergear',
				timestamp: new Date(2026, 5, 15, 9, 21),
			},
			{
				id: nanoid(),
				senderId: maria.id,
				text: 'También noté que no hay loading state en el botón de submit',
				timestamp: new Date(2026, 5, 15, 9, 25),
			},
			{
				id: nanoid(),
				senderId: CURRENT_USER_ID,
				text: 'Cierto, hay que deshabilitar el botón mientras se envía para evitar doble submit',
				timestamp: new Date(2026, 5, 15, 9, 26),
			},
			{
				id: nanoid(),
				senderId: maria.id,
				text: 'Exacto. Y muestra un spinner para feedback visual',
				timestamp: new Date(2026, 5, 15, 9, 27),
			},
			{
				id: nanoid(),
				senderId: CURRENT_USER_ID,
				text: 'Listo, ya lo agregué. También mejoré la validación del campo de email',
				timestamp: new Date(2026, 5, 15, 9, 35),
			},
			{
				id: nanoid(),
				senderId: maria.id,
				text: '¿Qué cambiaste?',
				timestamp: new Date(2026, 5, 15, 9, 36),
			},
			{
				id: nanoid(),
				senderId: CURRENT_USER_ID,
				text: 'Antes solo validaba con regex. Ahora también uso una API de verificación de dominios para detectar typos como gmial.com',
				timestamp: new Date(2026, 5, 15, 9, 37),
			},
			{
				id: nanoid(),
				senderId: maria.id,
				text: 'Oh eso está muy bueno! ¿Qué librería usaste?',
				timestamp: new Date(2026, 5, 15, 9, 38),
			},
			{
				id: nanoid(),
				senderId: CURRENT_USER_ID,
				text: 'No es librería, hice un fetch a la API de Mailcheck.me. Es gratuita hasta 100 requests/día',
				timestamp: new Date(2026, 5, 15, 9, 39),
			},
			{
				id: nanoid(),
				senderId: maria.id,
				text: 'Perfecto. Voy a darle otro look al PR',
				timestamp: new Date(2026, 5, 15, 9, 40),
			},
			{
				id: nanoid(),
				senderId: maria.id,
				text: 'Ok ya lo aprobé, pero dejé un par de comentarios menores',
				timestamp: new Date(2026, 5, 15, 10, 0),
			},
			{
				id: nanoid(),
				senderId: CURRENT_USER_ID,
				text: 'Gracias! Los miro ahora',
				timestamp: new Date(2026, 5, 15, 10, 1),
			},
			{
				id: nanoid(),
				senderId: maria.id,
				text: '¿También puedes revisar mi PR? Es el #45, es el fix del bug de paginación',
				timestamp: new Date(2026, 5, 15, 10, 10),
			},
			{
				id: nanoid(),
				senderId: CURRENT_USER_ID,
				text: 'Dale, lo miro en un rato',
				timestamp: new Date(2026, 5, 15, 10, 11),
			},
			{
				id: nanoid(),
				senderId: maria.id,
				text: 'Perfecto, avísame si tienes algún comentario 👍',
				timestamp: new Date(2026, 5, 15, 10, 12),
			},
			{
				id: nanoid(),
				senderId: CURRENT_USER_ID,
				text: 'Ya lo revisé. El fix está bien pero faltó agregar un test para el caso edge de página vacía',
				timestamp: new Date(2026, 5, 15, 10, 30),
			},
			{
				id: nanoid(),
				senderId: maria.id,
				text: 'Cierto, lo agrego ahora',
				timestamp: new Date(2026, 5, 15, 10, 31),
			},
			{
				id: nanoid(),
				senderId: maria.id,
				text: 'Listo, ya está. Puedes volver a revisar',
				timestamp: new Date(2026, 5, 15, 10, 45),
			},
			{
				id: nanoid(),
				senderId: CURRENT_USER_ID,
				text: 'Aprobado ✅',
				timestamp: new Date(2026, 5, 15, 10, 46),
			},
			{
				id: nanoid(),
				senderId: maria.id,
				text: '¡Genial! ¿Nos vemos en la standup de las 11?',
				timestamp: new Date(2026, 5, 15, 10, 47),
			},
			{
				id: nanoid(),
				senderId: CURRENT_USER_ID,
				text: 'Sí, ahí estaré',
				timestamp: new Date(2026, 5, 15, 10, 48),
			},
		],
		[carlos.id]: [
			{
				id: nanoid(),
				senderId: carlos.id,
				text: '¿Puedes revisar mi PR?',
				timestamp: new Date(2026, 5, 15, 9, 30),
			},
			{
				id: nanoid(),
				senderId: CURRENT_USER_ID,
				text: 'Dale, lo miro en un rato',
				timestamp: new Date(2026, 5, 15, 9, 35),
			},
			{
				id: nanoid(),
				senderId: carlos.id,
				text: 'Revisé el código, se ve bien 👍',
				timestamp: new Date(2026, 5, 15, 9, 45),
			},
			{
				id: nanoid(),
				senderId: carlos.id,
				text: 'Mira cómo se ve el dashboard:',
				timestamp: new Date(2026, 5, 15, 9, 46),
				attachment: {
					url: 'https://media.vandal.net/i/1280x720/10-2023/18/202310181641400_2.jpg.webp',
					type: 'image',
					name: 'dashboard-preview.jpg',
					size: 245760,
				},
			},
			{
				id: nanoid(),
				senderId: CURRENT_USER_ID,
				text: 'Se ve genial! Pero el gráfico de barras está cortado',
				timestamp: new Date(2026, 5, 15, 9, 50),
			},
			{
				id: nanoid(),
				senderId: carlos.id,
				text: 'Te mando las flores del jardín:',
				timestamp: new Date(2026, 5, 15, 9, 51),
				attachment: {
					url: 'https://verdecora.es/blog/wp-content/uploads/2015/07/flores-verano-jardin.jpg',
					type: 'image',
					name: 'flores-jardin.jpg',
					size: 184320,
				},
			},
			{
				id: nanoid(),
				senderId: carlos.id,
				text: 'Y el video del bug:',
				timestamp: new Date(2026, 5, 15, 9, 52),
				attachment: {
					url: 'https://avtshare01.rz.tu-ilmenau.de/avt-vqdb-uhd-1/test_1/segments/bigbuck_bunny_8bit_15000kbps_2160p_60.0fps_vp9.mkv',
					type: 'video',
					name: 'bug-reproduction.mkv',
					size: 1572864,
				},
			},
			{
				id: nanoid(),
				senderId: CURRENT_USER_ID,
				text: 'Ya lo veo. Te paso el documento con la solución:',
				timestamp: new Date(2026, 5, 15, 10, 0),
				attachment: {
					url: '#',
					type: 'document',
					name: 'fix-chart-height.pdf',
					size: 102400,
				},
			},
		],
		[ana.id]: [
			{
				id: nanoid(),
				senderId: ana.id,
				text: '¿Tenemos reunión hoy?',
				timestamp: new Date(2026, 5, 15, 8, 15),
			},
			{
				id: nanoid(),
				senderId: CURRENT_USER_ID,
				text: 'Sí, a las 2pm en la sala de juntas',
				timestamp: new Date(2026, 5, 15, 8, 20),
			},
			{
				id: nanoid(),
				senderId: ana.id,
				text: 'Perfecto, gracias!',
				timestamp: new Date(2026, 5, 15, 8, 21),
			},
		],
		[pedro.id]: [
			{
				id: nanoid(),
				senderId: pedro.id,
				text: 'El deploy está programado para las 5pm',
				timestamp: new Date(2026, 5, 14, 17, 30),
			},
			{
				id: nanoid(),
				senderId: CURRENT_USER_ID,
				text: 'Ok, ya estoy preparando el changelog',
				timestamp: new Date(2026, 5, 14, 17, 35),
			},
		],
		[laura.id]: [
			{
				id: nanoid(),
				senderId: CURRENT_USER_ID,
				text: '¿Necesitas ayuda con el bug del login?',
				timestamp: new Date(2026, 5, 14, 14, 15),
			},
			{
				id: nanoid(),
				senderId: laura.id,
				text: 'Gracias por la ayuda!',
				timestamp: new Date(2026, 5, 14, 14, 20),
			},
		],
		[dev.id]: [
			{
				id: nanoid(),
				senderId: pedro.id,
				text: 'Sprint planning mañana a las 10am',
				timestamp: new Date(2026, 5, 13, 16, 0),
			},
			{
				id: nanoid(),
				senderId: carlos.id,
				text: 'Anotado!',
				timestamp: new Date(2026, 5, 13, 16, 5),
			},
			{
				id: nanoid(),
				senderId: CURRENT_USER_ID,
				text: 'Yo estaré ahí',
				timestamp: new Date(2026, 5, 13, 16, 10),
			},
			{
				id: nanoid(),
				senderId: pedro.id,
				text: 'Buenos días equipo! Les comparto el board del sprint 24: https://jira.board/sprint-24',
				timestamp: new Date(2026, 5, 14, 10, 0),
			},
			{
				id: nanoid(),
				senderId: maria.id,
				text: 'Gracias Pedro. Veo que hay 3 bugs críticos en el backlog',
				timestamp: new Date(2026, 5, 14, 10, 5),
			},
			{
				id: nanoid(),
				senderId: pedro.id,
				text: 'Sí, el del login está bloqueando a varios usuarios. Hay que priorizarlo',
				timestamp: new Date(2026, 5, 14, 10, 6),
			},
			{
				id: nanoid(),
				senderId: CURRENT_USER_ID,
				text: 'Yo puedo tomar el bug del login. Ya revisé los logs y parece un problema de token refresh',
				timestamp: new Date(2026, 5, 14, 10, 8),
			},
			{
				id: nanoid(),
				senderId: carlos.id,
				text: 'Perfecto. El otro bug del reporte de ventas lo tomo yo',
				timestamp: new Date(2026, 5, 14, 10, 10),
			},
			{
				id: nanoid(),
				senderId: maria.id,
				text: 'Y el tercero del export CSV puedo encargarme yo',
				timestamp: new Date(2026, 5, 14, 10, 12),
			},
			{
				id: nanoid(),
				senderId: pedro.id,
				text: 'Perfecto equipo. El feature del dashboard de métricas sigue en progress, ¿cómo va?',
				timestamp: new Date(2026, 5, 14, 10, 15),
			},
			{
				id: nanoid(),
				senderId: laura.id,
				text: 'Ya terminé la parte del backend. Los endpoints están documentados en Swagger',
				timestamp: new Date(2026, 5, 14, 10, 18),
			},
			{
				id: nanoid(),
				senderId: carlos.id,
				text: 'Genial. Yo estoy con el frontend. Los gráficos de Chart.js ya están integrados',
				timestamp: new Date(2026, 5, 14, 10, 20),
			},
			{
				id: nanoid(),
				senderId: maria.id,
				text: '¿Necesitan ayuda con algo? Yo terminé temprano con mi tarea',
				timestamp: new Date(2026, 5, 14, 10, 22),
			},
			{
				id: nanoid(),
				senderId: carlos.id,
				text: 'María, ¿puedes revisar los tests del módulo de reportes? Quiero asegurarme de que no rompí nada',
				timestamp: new Date(2026, 5, 14, 10, 25),
			},
			{
				id: nanoid(),
				senderId: maria.id,
				text: 'Dale, los corro ahora',
				timestamp: new Date(2026, 5, 14, 10, 26),
			},
			{
				id: nanoid(),
				senderId: maria.id,
				text: 'Los tests pasan ✅ Pero hay 2 warnings de deprecación en React 19',
				timestamp: new Date(2026, 5, 14, 10, 35),
			},
			{
				id: nanoid(),
				senderId: CURRENT_USER_ID,
				text: '¿Cuáles son? Quizás podemos actualizar las dependencias',
				timestamp: new Date(2026, 5, 14, 10, 36),
			},
			{
				id: nanoid(),
				senderId: maria.id,
				text: 'findDOMNode está deprecated en StrictMode. Hay que usar refs en su lugar',
				timestamp: new Date(2026, 5, 14, 10, 37),
			},
			{
				id: nanoid(),
				senderId: laura.id,
				text: 'Eso es de react-bootstrap. Tienen una issue abierta, está programado para v2.5.0',
				timestamp: new Date(2026, 5, 14, 10, 38),
			},
			{
				id: nanoid(),
				senderId: pedro.id,
				text: 'Ok, lo dejamos así por ahora. Actualizamos cuando saquen la nueva versión',
				timestamp: new Date(2026, 5, 14, 10, 40),
			},
			{
				id: nanoid(),
				senderId: pedro.id,
				text: 'Recordatorio: el deploy de producción es mañana a las 5pm. Les envío el checklist por email',
				timestamp: new Date(2026, 5, 14, 11, 0),
			},
			{
				id: nanoid(),
				senderId: CURRENT_USER_ID,
				text: 'Yo preparo el changelog y las release notes',
				timestamp: new Date(2026, 5, 14, 11, 5),
			},
			{
				id: nanoid(),
				senderId: carlos.id,
				text: 'Perfecto. Yo me encargo del build y el deploy a staging primero',
				timestamp: new Date(2026, 5, 14, 11, 6),
			},
			{
				id: nanoid(),
				senderId: laura.id,
				text: '¿Quién hace el smoke test en staging?',
				timestamp: new Date(2026, 5, 14, 11, 8),
			},
			{
				id: nanoid(),
				senderId: maria.id,
				text: 'Yo puedo hacerlo. Tengo el script de testing automatizado listo',
				timestamp: new Date(2026, 5, 14, 11, 10),
			},
			{
				id: nanoid(),
				senderId: pedro.id,
				text: 'Equipo, acabo de recibir un mail de DevOps. Hay un cambio en la configuración de NGINX que puede afectar el proxy reverso',
				timestamp: new Date(2026, 5, 14, 15, 0),
			},
			{
				id: nanoid(),
				senderId: CURRENT_USER_ID,
				text: '¿Qué cambió exactamente?',
				timestamp: new Date(2026, 5, 14, 15, 2),
			},
			{
				id: nanoid(),
				senderId: pedro.id,
				text: 'Aumentaron el proxy_read_timeout de 60s a 300s para los endpoints de upload. Es bueno, evita timeouts en uploads grandes',
				timestamp: new Date(2026, 5, 14, 15, 3),
			},
			{
				id: nanoid(),
				senderId: carlos.id,
				text: 'Bien, eso resuelve el bug que teníamos con archivos de más de 50MB',
				timestamp: new Date(2026, 5, 14, 15, 5),
			},
			{
				id: nanoid(),
				senderId: maria.id,
				text: '¿Pero no necesitamos actualizar el nginx.conf del repo también?',
				timestamp: new Date(2026, 5, 14, 15, 7),
			},
			{
				id: nanoid(),
				senderId: pedro.id,
				text: 'No, ese es el del servidor de producción. El nuestro es para development y tiene valores por defecto',
				timestamp: new Date(2026, 5, 14, 15, 8),
			},
			{
				id: nanoid(),
				senderId: CURRENT_USER_ID,
				text: 'Ok, perfecto. ¿Algo más que debamos saber antes del deploy?',
				timestamp: new Date(2026, 5, 14, 15, 10),
			},
			{
				id: nanoid(),
				senderId: pedro.id,
				text: 'Sí, hay un feature flag nuevo para el módulo de pagos. Está desactivado por defecto, lo activamos el lunes después de verificar',
				timestamp: new Date(2026, 5, 14, 15, 12),
			},
			{
				id: nanoid(),
				senderId: laura.id,
				text: 'Genial. Les recuerdo que tenemos daily standup en 5 minutos',
				timestamp: new Date(2026, 5, 14, 15, 25),
			},
			{
				id: nanoid(),
				senderId: maria.id,
				text: 'Estoy lista!',
				timestamp: new Date(2026, 5, 14, 15, 26),
			},
			{
				id: nanoid(),
				senderId: carlos.id,
				text: 'Yo también, me conecto en un momento',
				timestamp: new Date(2026, 5, 14, 15, 27),
			},
			{
				id: nanoid(),
				senderId: CURRENT_USER_ID,
				text: 'Ahí estoy 👍',
				timestamp: new Date(2026, 5, 14, 15, 28),
			},
			{
				id: nanoid(),
				senderId: pedro.id,
				text: 'Equipo, el deploy de hoy fue exitoso! 🚀 Todo funciona correctamente en producción',
				timestamp: new Date(2026, 5, 15, 17, 30),
			},
			{
				id: nanoid(),
				senderId: maria.id,
				text: 'Excelente! El smoke test pasó sin problemas',
				timestamp: new Date(2026, 5, 15, 17, 32),
			},
			{
				id: nanoid(),
				senderId: carlos.id,
				text: 'Los gráficos del dashboard se ven geniales en producción 👏',
				timestamp: new Date(2026, 5, 15, 17, 33),
			},
			{
				id: nanoid(),
				senderId: CURRENT_USER_ID,
				text: 'El changelog está publicado en GitHub. Les envié el link por email',
				timestamp: new Date(2026, 5, 15, 17, 35),
			},
			{
				id: nanoid(),
				senderId: laura.id,
				text: 'Les comparto las métricas del deploy: 0 errores, tiempo promedio de respuesta 45ms, uptime 100% hasta ahora',
				timestamp: new Date(2026, 5, 15, 17, 40),
			},
			{
				id: nanoid(),
				senderId: pedro.id,
				text: 'Perfecto equipo. Mañana retrospective a las 11am. Preparen sus puntos para discutir',
				timestamp: new Date(2026, 5, 15, 17, 45),
			},
			{
				id: nanoid(),
				senderId: maria.id,
				text: 'Buen trabajo todos! 🎉',
				timestamp: new Date(2026, 5, 15, 17, 46),
			},
			{
				id: nanoid(),
				senderId: CURRENT_USER_ID,
				text: 'Gran sprint! Nos vemos mañana',
				timestamp: new Date(2026, 5, 15, 17, 47),
			},
		],
	}

	return { contacts, messages, devTeamId: dev.id }
}

const {
	contacts: initialContacts,
	messages: initialMessages,
	devTeamId,
} = generateMockData()

function getAutoReply(): string {
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
	return replies[Math.floor(Math.random() * replies.length)]!
}

export function Component() {
	const { contactId } = useParams<{ contactId: string }>()
	const navigate = useNavigate()
	const [allMessages, setAllMessages] =
		useState<Record<string, ChatMessage[]>>(initialMessages)
	const [contacts, setContacts] = useState<ChatContact[]>(initialContacts)
	const [typingContactId, setTypingContactId] = useState<string | undefined>()

	const selectedContactId = contactId

	const handleSelectContact = useCallback(
		(id: string) => {
			navigate(`/examples/chat/${id}`, { replace: true })
			setContacts((prev) =>
				prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c)),
			)
		},
		[navigate],
	)

	const handleSendMessage = useCallback(
		(text: string, attachment?: ChatAttachment) => {
			if (!selectedContactId) return

			const newMsg: ChatMessage = {
				id: nanoid(),
				senderId: CURRENT_USER_ID,
				text,
				timestamp: new Date(),
				status: 'sent',
				attachment,
			}

			setAllMessages((prev) => ({
				...prev,
				[selectedContactId]: [...(prev[selectedContactId] ?? []), newMsg],
			}))

			const lastText = attachment
				? text ||
					`[${attachment.type === 'image' ? 'Imagen' : attachment.type === 'video' ? 'Video' : 'Archivo'}]`
				: text

			setContacts((prev) =>
				prev.map((c) =>
					c.id === selectedContactId
						? { ...c, lastMessage: lastText, lastMessageTime: new Date() }
						: c,
				),
			)

			if (selectedContactId !== devTeamId) {
				setTypingContactId(selectedContactId)
				setTimeout(
					() => {
						setTypingContactId(undefined)
						const replyMsg: ChatMessage = {
							id: nanoid(),
							senderId: selectedContactId,
							text: getAutoReply(),
							timestamp: new Date(),
						}
						setAllMessages((prev) => ({
							...prev,
							[selectedContactId]: [
								...(prev[selectedContactId] ?? []),
								replyMsg,
							],
						}))
						setContacts((prev) =>
							prev.map((c) =>
								c.id === selectedContactId
									? {
											...c,
											lastMessage: replyMsg.text,
											lastMessageTime: new Date(),
										}
									: c,
							),
						)
					},
					1500 + Math.random() * 1000,
				)
			}
		},
		[selectedContactId],
	)

	const handleBack = useCallback(() => {
		navigate('/examples/chat', { replace: true })
	}, [navigate])

	const handleNewChat = useCallback(() => {
		navigate('/examples/chat', { replace: true })
	}, [navigate])

	return (
		<Chat
			contacts={contacts}
			messages={allMessages}
			currentUserId={CURRENT_USER_ID}
			selectedContactId={selectedContactId}
			typingContactId={typingContactId}
			onSelectContact={handleSelectContact}
			onSendMessage={handleSendMessage}
			onBack={handleBack}
			onNewChat={handleNewChat}
		/>
	)
}
