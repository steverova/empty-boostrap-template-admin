type DisableWrapperProps = {
	children: React.ReactNode
	disabled?: boolean
}

const DisableWrapper = ({
	children,
	disabled = false,
}: DisableWrapperProps) => {
	return (
		<div
			style={{
				opacity: disabled ? 0.6 : 1,
				// keep pointer events enabled on the container so an overlay can capture them
				pointerEvents: 'auto',
				position: 'relative',
			}}
			aria-disabled={disabled}
		>
			{children}

			{disabled && (
				// overlay captures pointer events and shows not-allowed cursor
				<div
					style={{
						position: 'absolute',
						inset: 0,
						zIndex: 999,
						cursor: 'not-allowed',
						background: 'transparent',
					}}
				/>
			)}
		</div>
	)
}

export default DisableWrapper
