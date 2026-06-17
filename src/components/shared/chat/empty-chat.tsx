import { Send } from 'lucide-react'
import { emptyChat } from './chat.css'

export function EmptyChat() {
	return (
		<div className={emptyChat}>
			<Send size={48} strokeWidth={1} />
			<h5 className='mb-0'>Selecciona una conversación</h5>
			<p className='text-center mb-0'>
				Elige un contacto de la lista para comenzar a chatear
			</p>
		</div>
	)
}
