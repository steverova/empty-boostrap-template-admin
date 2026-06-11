import { elevationStyle, iconButtonStyle } from './icon-button.css'

type IconButtonProps = Omit<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	'aria-label'
> & {
	icon: React.ReactNode
	size?: 'sm' | 'md' | 'lg'
	elevation?: boolean
	'aria-label': string
}

export default function IconButton({
	icon,
	size = 'md',
	elevation = false,
	className,
	disabled,
	type = 'button',
	'aria-label': ariaLabel,
	...props
}: IconButtonProps) {
	return (
		<button
			className={`${iconButtonStyle[size]} ${elevation ? elevationStyle : ''} ${className ?? ''}`}
			disabled={disabled}
			aria-disabled={disabled || undefined}
			type={type}
			aria-label={ariaLabel}
			{...props}
		>
			{icon}
		</button>
	)
}
