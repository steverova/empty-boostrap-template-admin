export const convertValueToString = (value: unknown): string => {
	if (value === null || value === undefined) {
		return ''
	}

	if (typeof value === 'string') {
		return value
	}

	if (typeof value === 'number' || typeof value === 'boolean') {
		return String(value)
	}

	if (value instanceof Date) {
		return value.toISOString()
	}

	if (Array.isArray(value)) {
		return value.join(', ')
	}

	if (typeof value === 'object') {
		return JSON.stringify(value)
	}

	return String(value)
}

export const copyToClipboard = async (text: string): Promise<void> => {
	try {
		await navigator.clipboard.writeText(text)
	} catch (err) {
		console.error('Failed to copy to clipboard:', err)
		throw err
	}
}
