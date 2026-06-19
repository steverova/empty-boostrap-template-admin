import { Inbox, type LucideIcon } from 'lucide-react'
import { type CSSProperties, type ReactNode } from 'react'
import { Button, type ButtonProps } from 'react-bootstrap'

interface EmptyStateProps {
	icon?: LucideIcon
	iconSize?: number
	title: string
	description?: string
	action?: {
		label: string
		onClick?: () => void
		variant?: ButtonProps['variant']
		href?: string
		icon?: LucideIcon
	}
	secondaryAction?: {
		label: string
		onClick?: () => void
		icon?: LucideIcon
	}
	children?: ReactNode
	className?: string
	style?: CSSProperties
}

export default function EmptyState({
	icon: Icon = Inbox,
	iconSize = 48,
	title,
	description,
	action,
	secondaryAction,
	children,
	className,
	style,
}: EmptyStateProps) {
	return (
		<div
			className={`d-flex flex-column align-items-center justify-content-center text-center py-5 px-3 ${className ?? ''}`}
			style={style}
		>
			<div
				className='d-flex align-items-center justify-content-center rounded-circle bg-body-tertiary mb-3'
				style={{
					width: iconSize * 2,
					height: iconSize * 2,
				}}
			>
				<Icon size={iconSize} className='text-body-secondary' strokeWidth={1.5} />
			</div>

			<h5 className='fw-semibold mb-1'>{title}</h5>

			{description && (
				<p className='text-body-secondary mb-0' style={{ maxWidth: 360 }}>
					{description}
				</p>
			)}

			{(action || secondaryAction) && (
				<div className='d-flex gap-2 mt-3'>
					{action && (
						<Button
							variant={action.variant ?? 'primary'}
							onClick={action.onClick}
							href={action.href}
						>
							{action.icon && <action.icon size={16} className='me-1' />}
							{action.label}
						</Button>
					)}
					{secondaryAction && (
						<Button
							variant='outline-secondary'
							onClick={secondaryAction.onClick}
						>
							{secondaryAction.icon && <secondaryAction.icon size={16} className='me-1' />}
							{secondaryAction.label}
						</Button>
					)}
				</div>
			)}

			{children}
		</div>
	)
}
