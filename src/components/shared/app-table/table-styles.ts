export const selectStyles = {
	singleValue: (base: Record<string, any>) => ({
		...base,
		textAlign: 'center' as const,
		width: '100%',
	}),
	control: (base: Record<string, any>) => ({
		...base,
		textAlign: 'center' as const,
	}),
	option: (base: Record<string, any>) => ({
		...base,
		textAlign: 'center' as const,
	}),
}