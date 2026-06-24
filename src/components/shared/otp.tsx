import {
	type ClipboardEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'

interface OtpProps {
	length?: number
	value?: string
	onChange?: (value: string) => void
	onComplete?: (value: string) => void
	disabled?: boolean
	autoFocus?: boolean
	accentColor?: string
	className?: string
}

export default function Otp({
	length = 6,
	value = '',
	onChange,
	onComplete,
	disabled = false,
	autoFocus = true,
	accentColor = '#0d6efd',
	className,
}: OtpProps) {
	const [digits, setDigits] = useState<string[]>(() => {
		const arr = value.split('').slice(0, length)
		while (arr.length < length) arr.push('')
		return arr
	})
	const inputRefs = useRef<(HTMLInputElement | null)[]>([])

	const expectedDigits = value.split('').slice(0, length)
	while (expectedDigits.length < length) expectedDigits.push('')
	const digitsMatch =
		expectedDigits.length === digits.length &&
		expectedDigits.every((d, i) => d === digits[i])
	if (!digitsMatch) {
		setDigits(expectedDigits)
	}

	useEffect(() => {
		if (autoFocus) {
			inputRefs.current[0]?.focus()
			inputRefs.current[0]?.select()
		}
	}, [autoFocus])

	const emitChange = useCallback(
		(next: string[]) => {
			const joined = next.join('')
			onChange?.(joined)
			if (joined.length === length && !next.includes('')) {
				onComplete?.(joined)
			}
		},
		[length, onChange, onComplete],
	)

	const focusInput = useCallback(
		(index: number) => {
			const clamped = Math.max(0, Math.min(index, length - 1))
			inputRefs.current[clamped]?.focus()
			inputRefs.current[clamped]?.select()
		},
		[length],
	)

	const handleChange = useCallback(
		(index: number, raw: string) => {
			const char = raw.replace(/\D/g, '').slice(-1)
			const next = [...digits]
			next[index] = char
			setDigits(next)
			emitChange(next)
			if (char && index < length - 1) {
				focusInput(index + 1)
			}
		},
		[digits, length, emitChange, focusInput],
	)

	const handleKeyDown = useCallback(
		(index: number, e: React.KeyboardEvent) => {
			if (e.key === 'Backspace') {
				e.preventDefault()
				const next = [...digits]
				if (next[index]) {
					next[index] = ''
					setDigits(next)
					emitChange(next)
				} else if (index > 0) {
					next[index - 1] = ''
					setDigits(next)
					emitChange(next)
					focusInput(index - 1)
				}
			} else if (e.key === 'ArrowLeft') {
				e.preventDefault()
				focusInput(index - 1)
			} else if (e.key === 'ArrowRight') {
				e.preventDefault()
				focusInput(index + 1)
			} else if (e.key === 'Enter') {
				e.preventDefault()
				const joined = digits.join('')
				if (joined.length === length && !joined.includes('')) {
					onComplete?.(joined)
				}
			}
		},
		[digits, length, emitChange, focusInput, onComplete],
	)

	const handlePaste = useCallback(
		(e: ClipboardEvent<HTMLInputElement>) => {
			e.preventDefault()
			const text = e.clipboardData
				.getData('text')
				.replace(/\D/g, '')
				.slice(0, length)
			if (!text) return
			const next = [...digits]
			for (let i = 0; i < text.length; i++) {
				next[i] = text[i]
			}
			setDigits(next)
			emitChange(next)
			const nextEmpty = next.findIndex((d) => !d)
			focusInput(nextEmpty === -1 ? length - 1 : nextEmpty)
		},
		[digits, length, emitChange, focusInput],
	)

	return (
		<div className={`${className} d-flex flex-column gap-3`}>
			<div className='d-flex justify-content-end'>
				<Button variant='outline-light' size='sm'>Resend</Button>
			</div>

			<InputGroup className='justify-content-center gap-1'>
				{digits.map((digit, i) => (
					<Form.Control
						key={i}
						ref={(el) => {
							inputRefs.current[i] = el
						}}
						type='text'
						inputMode='numeric'
						maxLength={2}
						autoComplete='one-time-code'
						disabled={disabled}
						value={digit}
						onChange={(e) => handleChange(i, e.target.value)}
						onKeyDown={(e) => handleKeyDown(i, e)}
						onPaste={handlePaste}
						onFocus={(e) => e.target.select()}
						className='text-center fw-semibold'
						style={{
							height: '48px',
							fontSize: '1.5rem',
							letterSpacing: '0',
							borderColor: digit ? accentColor : undefined,
							color: 'var(--bs-body-color)',
							backgroundColor: 'var(--bs-body-bg)',
						}}
					/>
				))}
			</InputGroup>

      <Button disabled={!digitsMatch} variant='light'>Confirm</Button>
		</div>
	)
}
