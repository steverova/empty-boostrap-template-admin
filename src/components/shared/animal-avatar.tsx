import { useAnimalAvatar } from '@hooks/use-animal-avatar'

interface AnimalAvatarProps {
	name: string
	size?: number
	palette?: number
	rounded?: boolean
	className?: string
}

export default function AnimalAvatar({
	name,
	size = 80,
	palette,
	rounded = true,
	className = '',
}: AnimalAvatarProps) {
	const { get } = useAnimalAvatar()
	const { svg } = get(name, { size, palette })

	return (
		<div
			className={`animal-avatar ${className}`}
			style={{
				width: size,
				height: size,
				borderRadius: rounded ? '50%' : undefined,
				overflow: 'hidden',
				flexShrink: 0,
				lineHeight: 0,
			}}
			dangerouslySetInnerHTML={{ __html: svg }}
		/>
	)
}
