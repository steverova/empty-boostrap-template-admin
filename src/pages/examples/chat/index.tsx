import { MessageSquare } from 'lucide-react'
import { useCallback, useState } from 'react'
import Chat, {
	type ChatAttachment,
	type ChatContact,
	type ChatMessage,
} from '@/components/shared/chat'

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
		{
			id: 'm1',
			senderId: 'user-1',
			text: '¡Hola! ¿Cómo estás?',
			timestamp: new Date(2026, 5, 15, 9, 0),
		},
		{
			id: 'm2',
			senderId: CURRENT_USER_ID,
			text: '¡Hola María! Bien, aquí trabajando en el sprint',
			timestamp: new Date(2026, 5, 15, 9, 2),
		},
		{
			id: 'm3',
			senderId: 'user-1',
			text: '¿Terminaste el módulo de reportes?',
			timestamp: new Date(2026, 5, 15, 9, 5),
		},
		{
			id: 'm4',
			senderId: CURRENT_USER_ID,
			text: 'Sí, ya lo terminé. Está en el PR #42',
			timestamp: new Date(2026, 5, 15, 9, 7),
		},
		{
			id: 'm5',
			senderId: 'user-1',
			text: 'Genial, lo reviso ahora mismo',
			timestamp: new Date(2026, 5, 15, 9, 8),
		},
		{
			id: 'm6',
			senderId: 'user-1',
			text: 'Una pregunta, ¿por qué usaste useState en vez de useReducer para el formulario?',
			timestamp: new Date(2026, 5, 15, 9, 15),
		},
		{
			id: 'm7',
			senderId: CURRENT_USER_ID,
			text: 'Buen punto. Al principio eran pocos campos pero ahora creció. Podría refactorizarse',
			timestamp: new Date(2026, 5, 15, 9, 18),
		},
		{
			id: 'm8',
			senderId: 'user-1',
			text: 'Sí, yo haría un useReducer con un action type por campo. Más limpio para manejar validaciones',
			timestamp: new Date(2026, 5, 15, 9, 20),
		},
		{
			id: 'm9',
			senderId: CURRENT_USER_ID,
			text: 'Tienes razón, lo cambio antes de mergear',
			timestamp: new Date(2026, 5, 15, 9, 21),
		},
		{
			id: 'm10',
			senderId: 'user-1',
			text: 'También noté que no hay loading state en el botón de submit',
			timestamp: new Date(2026, 5, 15, 9, 25),
		},
		{
			id: 'm11',
			senderId: CURRENT_USER_ID,
			text: 'Cierto, hay que deshabilitar el botón mientras se envía para evitar doble submit',
			timestamp: new Date(2026, 5, 15, 9, 26),
		},
		{
			id: 'm12',
			senderId: 'user-1',
			text: 'Exacto. Y muestra un spinner para feedback visual',
			timestamp: new Date(2026, 5, 15, 9, 27),
		},
		{
			id: 'm13',
			senderId: CURRENT_USER_ID,
			text: 'Listo, ya lo agregué. También mejoré la validación del campo de email',
			timestamp: new Date(2026, 5, 15, 9, 35),
		},
		{
			id: 'm14',
			senderId: 'user-1',
			text: '¿Qué cambiaste?',
			timestamp: new Date(2026, 5, 15, 9, 36),
		},
		{
			id: 'm15',
			senderId: CURRENT_USER_ID,
			text: 'Antes solo validaba con regex. Ahora también uso una API de verificación de dominios para detectar typos como gmial.com',
			timestamp: new Date(2026, 5, 15, 9, 37),
		},
		{
			id: 'm16',
			senderId: 'user-1',
			text: 'Oh eso está muy bueno! ¿Qué librería usaste?',
			timestamp: new Date(2026, 5, 15, 9, 38),
		},
		{
			id: 'm17',
			senderId: CURRENT_USER_ID,
			text: 'No es librería, hice un fetch a la API de Mailcheck.me. Es gratuita hasta 100 requests/día',
			timestamp: new Date(2026, 5, 15, 9, 39),
		},
		{
			id: 'm18',
			senderId: 'user-1',
			text: 'Perfecto. Voy a darle otro look al PR',
			timestamp: new Date(2026, 5, 15, 9, 40),
		},
		{
			id: 'm19',
			senderId: 'user-1',
			text: 'Ok ya lo aprobé, pero dejé un par de comentarios menores',
			timestamp: new Date(2026, 5, 15, 10, 0),
		},
		{
			id: 'm20',
			senderId: CURRENT_USER_ID,
			text: 'Gracias! Los miro ahora',
			timestamp: new Date(2026, 5, 15, 10, 1),
		},
		{
			id: 'm21',
			senderId: 'user-1',
			text: '¿También puedes revisar mi PR? Es el #45, es el fix del bug de paginación',
			timestamp: new Date(2026, 5, 15, 10, 10),
		},
		{
			id: 'm22',
			senderId: CURRENT_USER_ID,
			text: 'Dale, lo miro en un rato',
			timestamp: new Date(2026, 5, 15, 10, 11),
		},
		{
			id: 'm23',
			senderId: 'user-1',
			text: 'Perfecto, avísame si tienes algún comentario 👍',
			timestamp: new Date(2026, 5, 15, 10, 12),
		},
		{
			id: 'm24',
			senderId: CURRENT_USER_ID,
			text: 'Ya lo revisé. El fix está bien pero faltó agregar un test para el caso edge de página vacía',
			timestamp: new Date(2026, 5, 15, 10, 30),
		},
		{
			id: 'm25',
			senderId: 'user-1',
			text: 'Cierto, lo agrego ahora',
			timestamp: new Date(2026, 5, 15, 10, 31),
		},
		{
			id: 'm26',
			senderId: 'user-1',
			text: 'Listo, ya está. Puedes volver a revisar',
			timestamp: new Date(2026, 5, 15, 10, 45),
		},
		{
			id: 'm27',
			senderId: CURRENT_USER_ID,
			text: 'Aprobado ✅',
			timestamp: new Date(2026, 5, 15, 10, 46),
		},
		{
			id: 'm28',
			senderId: 'user-1',
			text: '¡Genial! ¿Nos vemos en la standup de las 11?',
			timestamp: new Date(2026, 5, 15, 10, 47),
		},
		{
			id: 'm29',
			senderId: CURRENT_USER_ID,
			text: 'Sí, ahí estaré',
			timestamp: new Date(2026, 5, 15, 10, 48),
		},
	],
	'user-2': [
		{
			id: 'm7',
			senderId: 'user-2',
			text: '¿Puedes revisar mi PR?',
			timestamp: new Date(2026, 5, 15, 9, 30),
		},
		{
			id: 'm8',
			senderId: CURRENT_USER_ID,
			text: 'Dale, lo miro en un rato',
			timestamp: new Date(2026, 5, 15, 9, 35),
		},
		{
			id: 'm9',
			senderId: 'user-2',
			text: 'Revisé el código, se ve bien 👍',
			timestamp: new Date(2026, 5, 15, 9, 45),
		},
		{
			id: 'm9a',
			senderId: 'user-2',
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
			id: 'm9b',
			senderId: CURRENT_USER_ID,
			text: 'Se ve genial! Pero el gráfico de barras está cortado',
			timestamp: new Date(2026, 5, 15, 9, 50),
		},
		{
			id: 'm9c',
			senderId: 'user-2',
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
			id: 'm9c2',
			senderId: 'user-2',
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
			id: 'm9d',
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
	'user-3': [
		{
			id: 'm10',
			senderId: 'user-3',
			text: '¿Tenemos reunión hoy?',
			timestamp: new Date(2026, 5, 15, 8, 15),
		},
		{
			id: 'm11',
			senderId: CURRENT_USER_ID,
			text: 'Sí, a las 2pm en la sala de juntas',
			timestamp: new Date(2026, 5, 15, 8, 20),
		},
		{
			id: 'm12',
			senderId: 'user-3',
			text: 'Perfecto, gracias!',
			timestamp: new Date(2026, 5, 15, 8, 21),
		},
	],
	'user-4': [
		{
			id: 'm13',
			senderId: 'user-4',
			text: 'El deploy está programado para las 5pm',
			timestamp: new Date(2026, 5, 14, 17, 30),
		},
		{
			id: 'm14',
			senderId: CURRENT_USER_ID,
			text: 'Ok, ya estoy preparando el changelog',
			timestamp: new Date(2026, 5, 14, 17, 35),
		},
	],
	'user-5': [
		{
			id: 'm15',
			senderId: CURRENT_USER_ID,
			text: '¿Necesitas ayuda con el bug del login?',
			timestamp: new Date(2026, 5, 14, 14, 15),
		},
		{
			id: 'm16',
			senderId: 'user-5',
			text: 'Gracias por la ayuda!',
			timestamp: new Date(2026, 5, 14, 14, 20),
		},
	],
	'user-6': [
		{
			id: 'm17',
			senderId: 'user-4',
			text: 'Sprint planning mañana a las 10am',
			timestamp: new Date(2026, 5, 13, 16, 0),
		},
		{
			id: 'm18',
			senderId: 'user-2',
			text: 'Anotado!',
			timestamp: new Date(2026, 5, 13, 16, 5),
		},
		{
			id: 'm19',
			senderId: CURRENT_USER_ID,
			text: 'Yo estaré ahí',
			timestamp: new Date(2026, 5, 13, 16, 10),
		},
		{
			id: 'm30',
			senderId: 'user-4',
			text: 'Buenos días equipo! Les comparto el board del sprint 24: https://jira.board/sprint-24',
			timestamp: new Date(2026, 5, 14, 10, 0),
		},
		{
			id: 'm31',
			senderId: 'user-1',
			text: 'Gracias Pedro. Veo que hay 3 bugs críticos en el backlog',
			timestamp: new Date(2026, 5, 14, 10, 5),
		},
		{
			id: 'm32',
			senderId: 'user-4',
			text: 'Sí, el del login está bloqueando a varios usuarios. Hay que priorizarlo',
			timestamp: new Date(2026, 5, 14, 10, 6),
		},
		{
			id: 'm33',
			senderId: CURRENT_USER_ID,
			text: 'Yo puedo tomar el bug del login. Ya revisé los logs y parece un problema de token refresh',
			timestamp: new Date(2026, 5, 14, 10, 8),
		},
		{
			id: 'm34',
			senderId: 'user-2',
			text: 'Perfecto. El otro bug del reporte de ventas lo tomo yo',
			timestamp: new Date(2026, 5, 14, 10, 10),
		},
		{
			id: 'm35',
			senderId: 'user-1',
			text: 'Y el tercero del export CSV puedo encargarme yo',
			timestamp: new Date(2026, 5, 14, 10, 12),
		},
		{
			id: 'm36',
			senderId: 'user-4',
			text: 'Perfecto equipo. El feature del dashboard de métricas sigue en progress, ¿cómo va?',
			timestamp: new Date(2026, 5, 14, 10, 15),
		},
		{
			id: 'm37',
			senderId: 'user-5',
			text: 'Ya terminé la parte del backend. Los endpoints están documentados en Swagger',
			timestamp: new Date(2026, 5, 14, 10, 18),
		},
		{
			id: 'm38',
			senderId: 'user-2',
			text: 'Genial. Yo estoy con el frontend. Los gráficos de Chart.js ya están integrados',
			timestamp: new Date(2026, 5, 14, 10, 20),
		},
		{
			id: 'm39',
			senderId: 'user-1',
			text: '¿Necesitan ayuda con algo? Yo terminé temprano con mi tarea',
			timestamp: new Date(2026, 5, 14, 10, 22),
		},
		{
			id: 'm40',
			senderId: 'user-2',
			text: 'María, ¿puedes revisar los tests del módulo de reportes? Quiero asegurarme de que no rompí nada',
			timestamp: new Date(2026, 5, 14, 10, 25),
		},
		{
			id: 'm41',
			senderId: 'user-1',
			text: 'Dale, los corro ahora',
			timestamp: new Date(2026, 5, 14, 10, 26),
		},
		{
			id: 'm42',
			senderId: 'user-1',
			text: 'Los tests pasan ✅ Pero hay 2 warnings de deprecación en React 19',
			timestamp: new Date(2026, 5, 14, 10, 35),
		},
		{
			id: 'm43',
			senderId: CURRENT_USER_ID,
			text: '¿Cuáles son? Quizás podemos actualizar las dependencias',
			timestamp: new Date(2026, 5, 14, 10, 36),
		},
		{
			id: 'm44',
			senderId: 'user-1',
			text: 'findDOMNode está deprecated en StrictMode. Hay que usar refs en su lugar',
			timestamp: new Date(2026, 5, 14, 10, 37),
		},
		{
			id: 'm45',
			senderId: 'user-5',
			text: 'Eso es de react-bootstrap. Tienen una issue abierta, está programado para v2.5.0',
			timestamp: new Date(2026, 5, 14, 10, 38),
		},
		{
			id: 'm46',
			senderId: 'user-4',
			text: 'Ok, lo dejamos así por ahora. Actualizamos cuando saquen la nueva versión',
			timestamp: new Date(2026, 5, 14, 10, 40),
		},
		{
			id: 'm47',
			senderId: 'user-4',
			text: 'Recordatorio: el deploy de producción es mañana a las 5pm. Les envío el checklist por email',
			timestamp: new Date(2026, 5, 14, 11, 0),
		},
		{
			id: 'm48',
			senderId: CURRENT_USER_ID,
			text: 'Yo preparo el changelog y las release notes',
			timestamp: new Date(2026, 5, 14, 11, 5),
		},
		{
			id: 'm49',
			senderId: 'user-2',
			text: 'Perfecto. Yo me encargo del build y el deploy a staging primero',
			timestamp: new Date(2026, 5, 14, 11, 6),
		},
		{
			id: 'm50',
			senderId: 'user-5',
			text: '¿Quién hace el smoke test en staging?',
			timestamp: new Date(2026, 5, 14, 11, 8),
		},
		{
			id: 'm51',
			senderId: 'user-1',
			text: 'Yo puedo hacerlo. Tengo el script de testing automatizado listo',
			timestamp: new Date(2026, 5, 14, 11, 10),
		},
		{
			id: 'm52',
			senderId: 'user-4',
			text: 'Equipo, acabo de recibir un mail de DevOps. Hay un cambio en la configuración de NGINX que puede afectar el proxy reverso',
			timestamp: new Date(2026, 5, 14, 15, 0),
		},
		{
			id: 'm53',
			senderId: CURRENT_USER_ID,
			text: '¿Qué cambió exactamente?',
			timestamp: new Date(2026, 5, 14, 15, 2),
		},
		{
			id: 'm54',
			senderId: 'user-4',
			text: 'Aumentaron el proxy_read_timeout de 60s a 300s para los endpoints de upload. Es bueno, evita timeouts en uploads grandes',
			timestamp: new Date(2026, 5, 14, 15, 3),
		},
		{
			id: 'm55',
			senderId: 'user-2',
			text: 'Bien, eso resuelve el bug que teníamos con archivos de más de 50MB',
			timestamp: new Date(2026, 5, 14, 15, 5),
		},
		{
			id: 'm56',
			senderId: 'user-1',
			text: '¿Pero no necesitamos actualizar el nginx.conf del repo también?',
			timestamp: new Date(2026, 5, 14, 15, 7),
		},
		{
			id: 'm57',
			senderId: 'user-4',
			text: 'No, ese es el del servidor de producción. El nuestro es para development y tiene valores por defecto',
			timestamp: new Date(2026, 5, 14, 15, 8),
		},
		{
			id: 'm58',
			senderId: CURRENT_USER_ID,
			text: 'Ok, perfecto. ¿Algo más que debamos saber antes del deploy?',
			timestamp: new Date(2026, 5, 14, 15, 10),
		},
		{
			id: 'm59',
			senderId: 'user-4',
			text: 'Sí, hay un feature flag nuevo para el módulo de pagos. Está desactivado por defecto, lo activamos el lunes después de verificar',
			timestamp: new Date(2026, 5, 14, 15, 12),
		},
		{
			id: 'm60',
			senderId: 'user-5',
			text: 'Genial. Les recuerdo que tenemos daily standup en 5 minutos',
			timestamp: new Date(2026, 5, 14, 15, 25),
		},
		{
			id: 'm61',
			senderId: 'user-1',
			text: 'Estoy lista!',
			timestamp: new Date(2026, 5, 14, 15, 26),
		},
		{
			id: 'm62',
			senderId: 'user-2',
			text: 'Yo también, me conecto en un momento',
			timestamp: new Date(2026, 5, 14, 15, 27),
		},
		{
			id: 'm63',
			senderId: CURRENT_USER_ID,
			text: 'Ahí estoy 👍',
			timestamp: new Date(2026, 5, 14, 15, 28),
		},
		{
			id: 'm64',
			senderId: 'user-4',
			text: 'Equipo, el deploy de hoy fue exitoso! 🚀 Todo funciona correctamente en producción',
			timestamp: new Date(2026, 5, 15, 17, 30),
		},
		{
			id: 'm65',
			senderId: 'user-1',
			text: 'Excelente! El smoke test pasó sin problemas',
			timestamp: new Date(2026, 5, 15, 17, 32),
		},
		{
			id: 'm66',
			senderId: 'user-2',
			text: 'Los gráficos del dashboard se ven geniales en producción 👏',
			timestamp: new Date(2026, 5, 15, 17, 33),
		},
		{
			id: 'm67',
			senderId: CURRENT_USER_ID,
			text: 'El changelog está publicado en GitHub. Les envié el link por email',
			timestamp: new Date(2026, 5, 15, 17, 35),
		},
		{
			id: 'm68',
			senderId: 'user-5',
			text: 'Les comparto las métricas del deploy: 0 errores, tiempo promedio de respuesta 45ms, uptime 100% hasta ahora',
			timestamp: new Date(2026, 5, 15, 17, 40),
		},
		{
			id: 'm69',
			senderId: 'user-4',
			text: 'Perfecto equipo. Mañana retrospective a las 11am. Preparen sus puntos para discutir',
			timestamp: new Date(2026, 5, 15, 17, 45),
		},
		{
			id: 'm70',
			senderId: 'user-1',
			text: 'Buen trabajo todos! 🎉',
			timestamp: new Date(2026, 5, 15, 17, 46),
		},
		{
			id: 'm71',
			senderId: CURRENT_USER_ID,
			text: 'Gran sprint! Nos vemos mañana',
			timestamp: new Date(2026, 5, 15, 17, 47),
		},
	],
}

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

export default function ChatExamplePage() {
	const [selectedContactId, setSelectedContactId] = useState<string>('user-1')
	const [allMessages, setAllMessages] =
		useState<Record<string, ChatMessage[]>>(mockMessages)
	const [contacts, setContacts] = useState<ChatContact[]>(mockContacts)
	const [typingContactId, setTypingContactId] = useState<string | undefined>()

	const handleSelectContact = useCallback((contactId: string) => {
		setSelectedContactId(contactId)
		setContacts((prev) =>
			prev.map((c) => (c.id === contactId ? { ...c, unreadCount: 0 } : c)),
		)
	}, [])

	const handleSendMessage = useCallback(
		(text: string, attachment?: ChatAttachment) => {
			if (!selectedContactId) return

			const newMsg: ChatMessage = {
				id: `m-${Date.now()}`,
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

			if (selectedContactId !== 'user-6') {
				setTypingContactId(selectedContactId)
				setTimeout(
					() => {
						setTypingContactId(undefined)
						const replyMsg: ChatMessage = {
							id: `m-reply-${Date.now()}`,
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

	return (
		<Chat
			contacts={contacts}
			messages={allMessages[selectedContactId] ?? []}
			currentUserId={CURRENT_USER_ID}
			selectedContactId={selectedContactId}
			typingContactId={typingContactId}
			onSelectContact={handleSelectContact}
			onSendMessage={handleSendMessage}
		/>
	)
}
