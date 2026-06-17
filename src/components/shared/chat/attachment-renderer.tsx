import { FileText } from 'lucide-react'
import { formatFileSize } from './chat.helper'
import type { ChatAttachment } from './types'

export function AttachmentRenderer({
	attachment,
}: { attachment: ChatAttachment }) {
	if (attachment.type === 'image') {
		return (
			<div className='mb-2'>
				<img
					src={attachment.url}
					alt={attachment.name}
					className='rounded-2 object-fit-cover'
					style={{ maxWidth: 260, maxHeight: 200, cursor: 'pointer' }}
				/>
			</div>
		)
	}

	if (attachment.type === 'video') {
		return (
			<div className='mb-2'>
				<video
					src={attachment.url}
					controls
					className='rounded-2 object-fit-cover'
					style={{ maxWidth: 300, maxHeight: 220 }}
				/>
			</div>
		)
	}

	return (
		<a
			href={attachment.url}
			target='_blank'
			rel='noopener noreferrer'
			className='d-flex align-items-center gap-2 p-2 rounded-2 text-decoration-none text-body'
			style={{ backgroundColor: 'rgba(0, 0, 0, 0.06)', maxWidth: 260, cursor: 'pointer', transition: 'background-color 0.15s ease' }}
		>
			<FileText size={24} className='flex-shrink-0 text-secondary' />
			<div className='d-flex flex-column min-width-0'>
				<span className='fw-medium' style={{ fontSize: '0.8rem' }}>
					<span className='text-truncate d-block'>{attachment.name}</span>
				</span>
				{attachment.size != null && (
					<span style={{ fontSize: '0.65rem', color: 'var(--bs-secondary-color)' }}>
						{formatFileSize(attachment.size)}
					</span>
				)}
			</div>
		</a>
	)
}
