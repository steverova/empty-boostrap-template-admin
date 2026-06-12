import { useThemeMode } from '@hooks/use-theme-mode'
import { Button } from 'react-bootstrap'

interface ButtonNeutralProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	outline?: boolean
	startIcon?: React.ReactNode
	endIcon?: React.ReactNode
	loading?: boolean
	loadingText?: string
}

export default function ButtonNeutral({
	className,
	children,
	outline = false,
	startIcon,
	endIcon,
	loading = false,
	loadingText,
	disabled,
	type = 'button',
	...props
}: ButtonNeutralProps) {
	const { themeMode } = useThemeMode()

	const baseVariant = themeMode === 'light' ? 'dark' : 'light'
	const themeVariant = outline ? `outline-${baseVariant} ` : baseVariant
	const isDisabled = disabled || loading

	return (
		<Button
			variant={themeVariant}
			className={className ?? undefined}
			disabled={isDisabled && !loading}
			aria-disabled={loading || undefined}
			aria-busy={loading || undefined}
			type={type}
			{...props}
		>
			<span
				className={`d-flex align-items-center gap-2 ${isDisabled ? 'opacity-50' : ''}`}
			>
				{loading ? (
					<>
						<span
							className='spinner-border spinner-border-sm'
							role='status'
							aria-hidden='true'
						/>
						<span aria-live='polite'>{loadingText ?? children}</span>
					</>
				) : (
					<>
						{startIcon && <span aria-hidden='true'>{startIcon}</span>}
						{children}
						{endIcon && <span aria-hidden='true'>{endIcon}</span>}
					</>
				)}
			</span>
		</Button>
	)
}
