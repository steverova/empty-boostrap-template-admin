import { useCallback, useRef, useState } from 'react'
import { Paperclip, Send } from 'lucide-react'
import { Button, Form } from 'react-bootstrap'
import { AttachmentRenderer } from './attachment-renderer'
import { getAttachmentType } from './chat.helper'
import type { ChatAttachment } from './types'

interface ChatFooterProps {
	onSendMessage: (text: string, attachment?: ChatAttachment) => void
}

export function ChatFooter({ onSendMessage }: ChatFooterProps) {
	const [inputText, setInputText] = useState('')
	const [pendingAttachment, setPendingAttachment] =
		useState<ChatAttachment | null>(null)
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleSend = useCallback(() => {
		const text = inputText.trim()
		if (!text && !pendingAttachment) return
		onSendMessage(text, pendingAttachment ?? undefined)
		setInputText('')
		setPendingAttachment(null)
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto'
		}
	}, [inputText, pendingAttachment, onSendMessage])

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
			if (e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault()
				handleSend()
			}
		},
		[handleSend],
	)

	const handleInput = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			setInputText(e.target.value)
			const el = e.target
			el.style.height = 'auto'
			el.style.height = `${Math.min(el.scrollHeight, 120)}px`
		},
		[],
	)

	const handleFileChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0]
			if (!file) return

			const url = URL.createObjectURL(file)
			setPendingAttachment({
				url,
				type: getAttachmentType(file),
				name: file.name,
				size: file.size,
			})

			e.target.value = ''
		},
		[],
	)

	const handleRemoveAttachment = useCallback(() => {
		if (pendingAttachment?.url.startsWith('blob:')) {
			URL.revokeObjectURL(pendingAttachment.url)
		}
		setPendingAttachment(null)
	}, [pendingAttachment])

	return (
		<>
			{pendingAttachment && (
				<div className='d-flex align-items-center gap-2 px-3 py-2 border-top bg-body'>
					<AttachmentRenderer attachment={pendingAttachment} />
					<Button
						variant='outline-danger'
						size='sm'
						onClick={handleRemoveAttachment}
					>
						×
					</Button>
				</div>
			)}
			<div className='d-flex align-items-end gap-2 p-3 border-top bg-body flex-shrink-0'>
				<input
					ref={fileInputRef}
					type='file'
					accept='image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip'
					style={{ display: 'none' }}
					onChange={handleFileChange}
				/>
				<Button
					variant='outline-secondary'
					size='sm'
					onClick={() => fileInputRef.current?.click()}
					className='rounded-circle d-flex align-items-center justify-content-center'
					style={{ width: 36, height: 36 }}
				>
					<Paperclip size={16} />
				</Button>
				<Form.Control
					ref={textareaRef}
					as='textarea'
					rows={1}
					className='flex-grow-1'
					style={{ resize: 'none', borderRadius: 20, minHeight: 40, maxHeight: 120, fontSize: '0.875rem', lineHeight: 1.4 }}
					placeholder='Escribe un mensaje...'
					value={inputText}
					onChange={handleInput}
					onKeyDown={handleKeyDown}
				/>
				<Button
					variant='primary'
					onClick={handleSend}
					disabled={!inputText.trim() && !pendingAttachment}
					className='rounded-circle d-flex align-items-center justify-content-center flex-shrink-0'
					style={{ width: 40, height: 40 }}
				>
					<Send size={16} />
				</Button>
			</div>
		</>
	)
}
