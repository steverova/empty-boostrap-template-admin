import { nanoid } from 'nanoid'
import { useCallback, useMemo, useState } from 'react'

export function useModal<T = undefined>() {
	const [isOpen, setIsOpen] = useState(false)
	const [data, setData] = useState<T>()

	const id = useMemo(() => nanoid(), [])

	const open = useCallback((newData?: T) => {
		setData(newData)
		setIsOpen(true)
	}, [])

	const close = useCallback(() => {
		setIsOpen(false)
	}, [])

	const toggle = useCallback(() => {
		setIsOpen((prev) => !prev)
	}, [])

	return {
		id,
		isOpen,
		data,
		setData,
		open,
		close,
		toggle,
	}
}
