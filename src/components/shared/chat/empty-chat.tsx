import { Send } from 'lucide-react'

export function EmptyChat() {
	return (
		<div className='d-flex flex-column align-items-center justify-content-center flex-grow-1 gap-3 text-secondary p-4'>
			<Send size={48} strokeWidth={1} />
			<h5 className='mb-0'>Selecciona una conversación</h5>
			<p className='text-center mb-0'>
				Elige un contacto de la lista para comenzar a chatear
			</p>
		</div>
	)
}
