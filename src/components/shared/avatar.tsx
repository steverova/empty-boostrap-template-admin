import { type CSSProperties, type ReactNode, useMemo } from 'react'

const ANIMALS = [
	'🐷',
	'🐮',
	'🐨',
	'🐵',
	'🐶',
	'🐺',
	'🦊',
	'🦝',
	'🐯',
	'🐹',
	'🐭',
	'🐰',
	'🐻',
	'🐻‍❄️',
	'🐸',
	'🐔',
	'🐣',
	'🐧',
	'🦉',
	'🐋',
	'🦋',
	'🐞',
] as const

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

type AvatarStatus = 'online' | 'offline' | 'away' | 'busy'

type AvatarVariant = 'emoji' | 'initials' | 'image'

type AvatarShape = 'circle' | 'rounded' | 'square'

type AvatarPreset = 'default' | 'minimal' | 'playful' | 'vibrant'

interface AvatarProps {
	seed: string | number

	variant?: AvatarVariant

	name?: string
	src?: string

	size?: AvatarSize | number

	shape?: AvatarShape

	status?: AvatarStatus

	selected?: boolean

	badge?: ReactNode

	preset?: AvatarPreset

	features?: {
		colors?: boolean
		gradient?: boolean
		border?: boolean
		shadow?: boolean
		rotation?: boolean
	}

	className?: string
	style?: CSSProperties

	onClick?: () => void
}

function hashString(value: string): number {
	let hash = 0

	for (let i = 0; i < value.length; i++) {
		hash = (hash << 5) - hash + value.charCodeAt(i)
		hash |= 0
	}

	return Math.abs(hash)
}

function getSize(size: AvatarSize | number): number {
	if (typeof size === 'number') {
		return size
	}

	switch (size) {
		case 'xs':
			return 24
		case 'sm':
			return 32
		case 'lg':
			return 56
		case 'xl':
			return 72
		default:
			return 40
	}
}

function getInitials(name?: string): string {
	if (!name) {
		return '👤'
	}

	return name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((word) => word[0]?.toUpperCase())
		.join('')
}

function getStatusColor(status?: AvatarStatus): string {
	switch (status) {
		case 'online':
			return '#22c55e'
		case 'away':
			return '#f59e0b'
		case 'busy':
			return '#ef4444'
		default:
			return '#9ca3af'
	}
}

function buildAvatar(seed: string) {
	const hash = hashString(seed)

	const hue1 = hash % 360
	const hue2 = (hue1 + 40) % 360

	return {
		emoji: ANIMALS[hash % ANIMALS.length],

		background: `hsl(${hue1} 75% 85%)`,

		border: `hsl(${hue1} 55% 65%)`,

		gradient: `linear-gradient(
			135deg,
			hsl(${hue1} 80% 88%),
			hsl(${hue2} 80% 75%)
		)`,

		rotation: (hash % 11) - 5,

		hue: hue1,
	}
}

export function Avatar({
	seed,

	variant = 'emoji',

	name,
	src,

	size = 'md',

	shape = 'circle',

	status,

	selected = false,

	badge,

	preset = 'default',

	features,

	className,
	style,

	onClick,
}: AvatarProps): React.JSX.Element {
	const px = getSize(size)

	const avatar = useMemo(() => buildAvatar(String(seed)), [seed])

	const config = {
		colors: true,
		gradient: preset !== 'minimal',
		border: true,
		shadow: preset === 'playful' || preset === 'vibrant',
		rotation: preset === 'playful',
		...features,
	}

	const borderRadius =
		shape === 'circle' ? '50%' : shape === 'rounded' ? '20%' : '8px'

	let content: ReactNode = avatar.emoji

	if (variant === 'initials') {
		content = getInitials(name)
	}

	if (variant === 'image' && src) {
		content = (
			<img
				src={src}
				alt={name ?? 'avatar'}
				style={{
					width: '100%',
					height: '100%',
					objectFit: 'cover',
				}}
			/>
		)
	}

	return (
		<div
			className={className}
			onClick={onClick}
			title={name}
			aria-label={name}
			style={{
				position: 'relative',

				width: px,
				height: px,

				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',

				fontSize: px * 0.5,

				borderRadius,

				background: config.colors
					? config.gradient
						? avatar.gradient
						: avatar.background
					: 'transparent',

				border: config.border
					? `2px solid ${selected ? '#2563eb' : avatar.border}`
					: undefined,

				boxShadow: config.shadow ? '0 4px 12px rgb(0 0 0 / 0.15)' : undefined,

				transform: config.rotation
					? `rotate(${avatar.rotation}deg)`
					: undefined,

				cursor: onClick ? 'pointer' : undefined,

				

				userSelect: 'none',

				...style,
			}}
		>
			{content}

			{status && (
				<span
					style={{
						position: 'absolute',
						right: 2,
						bottom: 2,
						zIndex: 99,
						width: px * 0.22,
						height: px * 0.22,

						borderRadius: '50%',

						background: getStatusColor(status),

						border: '2px solid white',
					}}
				/>
			)}

			{badge && (
				<div
					style={{
						position: 'absolute',
						top: -4,
						right: -4,
					}}
				>
					{badge}
				</div>
			)}
		</div>
	)
}
