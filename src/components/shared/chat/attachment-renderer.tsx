import { FileText } from 'lucide-react'
import {
	attachmentDocIcon,
	attachmentDocInfo,
	attachmentDocName,
	attachmentDocSize,
	attachmentDocument,
	attachmentImage,
	attachmentPreview,
	attachmentVideo,
} from './chat.css'
import { formatFileSize } from './chat.helper'
import type { ChatAttachment } from './types'

export function AttachmentRenderer({
	attachment,
}: { attachment: ChatAttachment }) {
	if (attachment.type === 'image') {
		return (
			<div className={attachmentPreview}>
				<img
					src={attachment.url}
					alt={attachment.name}
					className={attachmentImage}
				/>
			</div>
		)
	}

	if (attachment.type === 'video') {
		return (
			<div className={attachmentPreview}>
				<video src={attachment.url} controls className={attachmentVideo} />
			</div>
		)
	}

	return (
		<a
			href={attachment.url}
			target='_blank'
			rel='noopener noreferrer'
			className={attachmentDocument}
		>
			<FileText size={24} className={attachmentDocIcon} />
			<div className={attachmentDocInfo}>
				<span className={attachmentDocName}>{attachment.name}</span>
				{attachment.size != null && (
					<span className={attachmentDocSize}>
						{formatFileSize(attachment.size)}
					</span>
				)}
			</div>
		</a>
	)
}
