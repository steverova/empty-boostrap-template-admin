import { Button, type ButtonProps } from 'react-bootstrap'

type ButtonGhostProps = Omit<ButtonProps, 'variant'> & {
	variant?:
		| 'primary'
		| 'secondary'
		| 'success'
		| 'danger'
		| 'warning'
		| 'info'
		| 'light'
		| 'dark'
	iconOnly?: boolean
}

export default function ButtonGhost({
	variant = 'primary',
	iconOnly,
	className,
	children,
	...props
}: ButtonGhostProps) {
	return (
		<Button
			className={`btn-ghost btn-ghost-${variant} ${iconOnly ? 'p-2 d-inline-flex align-items-center justify-content-center' : ''} ${className ?? ''}`}
			{...props}
		>
			{children}
		</Button>
	)
}
