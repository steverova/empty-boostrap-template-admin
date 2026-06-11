import { type Cell, flexRender } from '@tanstack/react-table'
import type { JSX } from 'react'
import { useState } from 'react'
import Icon from '../../shared/Icon'
import { convertValueToString, copyToClipboard } from '../copy-utils'

type CopyActionProps<T = unknown> = {
	enableClickToCopy: boolean
	copiedCellId: string | null
	cell: Cell<T, unknown>
	setCopiedCellId: (id: string | null) => void
}

export default function CopyAction<T = unknown>({
	setCopiedCellId,
	enableClickToCopy,
	copiedCellId,
	cell
}: CopyActionProps<T>): JSX.Element {
	const [isHovering, setIsHovering] = useState(false)

	const handleCopy = (): void => {
		if (enableClickToCopy) {
			const value = cell.getValue()
			const textToCopy = convertValueToString(value)
			copyToClipboard(textToCopy).then(() => {
				setCopiedCellId(cell.id)
				setTimeout(() => setCopiedCellId(null), 2000)
			})
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent): void => {
		if ((e.key === 'Enter' || e.key === ' ') && enableClickToCopy) {
			handleCopy()
		}
	}

	return (
		<button
			className='d-flex gap-2 align-items-center'
			onClick={handleCopy}
			onKeyDown={handleKeyDown}
			onMouseEnter={(): void => setIsHovering(true)}
			onMouseLeave={(): void => setIsHovering(false)}
			style={{
				cursor: enableClickToCopy ? 'pointer' : 'default',
				border: 'none',
				background: 'transparent',
				padding: 0
			}}
			tabIndex={enableClickToCopy ? 0 : -1}
			type='button'>
			<div>{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
			{enableClickToCopy && (
				<span
					style={{
						opacity: copiedCellId === cell.id || isHovering ? 1 : 0,
						transition: 'opacity 0.2s',
						display: 'inline-flex',
						alignItems: 'center'
					}}>
					{copiedCellId === cell.id ? (
						<Icon
							ariaLabel='Copied'
							name='check-circle-fill'
							style={{ color: '#28a745', fontSize: '14px' }}
						/>
					) : (
						<i
							className='bi bi-copy'
							style={{ color: '#6c757d', fontSize: '14px' }}
						/>
					)}
				</span>
			)}
		</button>
	)
}
