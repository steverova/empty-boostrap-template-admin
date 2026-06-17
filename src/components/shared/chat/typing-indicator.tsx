export function TypingIndicator({ name }: { name: string }) {
	return (
		<div className='d-flex align-items-center gap-1 px-3 py-1' style={{ fontSize: '0.75rem', color: 'var(--bs-secondary-color)', fontStyle: 'italic' }}>
			<span>{name} está escribiendo</span>
			<span className='d-flex' style={{ gap: 3 }}>
				<span className='rounded-circle' style={{ width: 5, height: 5, backgroundColor: 'var(--bs-secondary-color)', animation: 'typingBounce 1.4s ease-in-out infinite' }} />
				<span className='rounded-circle' style={{ width: 5, height: 5, backgroundColor: 'var(--bs-secondary-color)', animation: 'typingBounce 1.4s ease-in-out infinite', animationDelay: '0.2s' }} />
				<span className='rounded-circle' style={{ width: 5, height: 5, backgroundColor: 'var(--bs-secondary-color)', animation: 'typingBounce 1.4s ease-in-out infinite', animationDelay: '0.4s' }} />
			</span>
		</div>
	)
}
