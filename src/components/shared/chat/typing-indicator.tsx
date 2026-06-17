import { typingDot, typingDots, typingIndicator } from './chat.css'

export function TypingIndicator({ name }: { name: string }) {
	return (
		<div className={typingIndicator}>
			<span>{name} está escribiendo</span>
			<span className={typingDots}>
				<span className={typingDot} />
				<span className={typingDot} />
				<span className={typingDot} />
			</span>
		</div>
	)
}
