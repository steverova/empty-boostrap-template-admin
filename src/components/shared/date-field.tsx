import { format, isValid, parse } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar } from 'lucide-react'
import {
	type ComponentProps,
	useCallback,
	useId,
	useMemo,
	useState,
} from 'react'
import { InputGroup } from 'react-bootstrap'

type DateFormat =
	| 'dd/MM/yyyy'
	| 'dd-MM-yyyy'
	| 'MM/dd/yyyy'
	| 'yyyy-MM-dd'
	| 'dd MMM yyyy'
	| 'dd MMMM yyyy'

interface DateFieldBaseProps
	extends Omit<ComponentProps<'input'>, 'value' | 'onChange' | 'type' | 'defaultValue'> {
	label?: string
	format?: DateFormat
	error?: string
}

interface ControlledProps extends DateFieldBaseProps {
	value: Date | null
	defaultValue?: never
	onChange: (date: Date | null) => void
}

interface UncontrolledProps extends DateFieldBaseProps {
	value?: never
	defaultValue?: Date | null
	onChange?: (date: Date | null) => void
}

type DateFieldProps = ControlledProps | UncontrolledProps

interface DateFormatPart {
	type: 'dd' | 'MM' | 'yyyy'
	length: number
}

interface ParsedFormat {
	parts: DateFormatPart[]
	separator: string
	totalDigits: number
}

const DIGIT_FORMATS: Record<DateFormat, string> = {
	'dd/MM/yyyy': 'dd/MM/yyyy',
	'dd-MM-yyyy': 'dd-MM-yyyy',
	'MM/dd/yyyy': 'MM/dd/yyyy',
	'yyyy-MM-dd': 'yyyy-MM-dd',
	'dd MMM yyyy': 'dd/MM/yyyy',
	'dd MMMM yyyy': 'dd/MM/yyyy',
}

function analyzeFormat(fmt: DateFormat): ParsedFormat {
	const digitFmt = DIGIT_FORMATS[fmt]
	const separator = digitFmt.includes('/') ? '/' : '-'
	const tokens = digitFmt.split(/[/-]/)
	const parts: DateFormatPart[] = tokens.map((t) => ({
		type: t as DateFormatPart['type'],
		length: t.length,
	}))
	const totalDigits = parts.reduce((sum, p) => sum + p.length, 0)
	return { parts, separator, totalDigits }
}

function formatDate(date: Date | null, fmt: DateFormat): string {
	if (!date || !isValid(date)) return ''
	return format(date, fmt, { locale: es })
}

function parseDate(value: string, fmt: DateFormat): Date | null {
	const { parts, separator, totalDigits } = analyzeFormat(fmt)
	const clean = value.replace(/\D/g, '')
	if (clean.length !== totalDigits) return null

	const dateObj: Record<string, number> = {}
	let offset = 0
	for (const part of parts) {
		dateObj[part.type] = Number(clean.slice(offset, offset + part.length))
		offset += part.length
	}

	const { dd, MM, yyyy } = dateObj as { dd: number; MM: number; yyyy: number }
	if (!yyyy || !MM || !dd) return null

	const digitFmt = DIGIT_FORMATS[fmt]
	const str = `${String(dd).padStart(2, '0')}${separator}${String(MM).padStart(2, '0')}${separator}${String(yyyy).padStart(4, '0')}`
	const date = parse(str, digitFmt, new Date())
	return isValid(date) ? date : null
}

function mask(value: string, fmt: DateFormat): string {
	const { parts, separator, totalDigits } = analyzeFormat(fmt)
	const digits = value.replace(/\D/g, '').slice(0, totalDigits)

	let offset = 0
	let result = ''
	for (let i = 0; i < parts.length; i++) {
		const part = parts[i]
		const segment = digits.slice(offset, offset + part.length)
		let validated = segment

		if (part.type === 'dd' && segment.length === 2) {
			const day = Number(segment)
			if (day < 1) validated = '01'
			if (day > 31) validated = '31'
		}

		if (part.type === 'MM' && segment.length === 2) {
			const month = Number(segment)
			if (month < 1) validated = '01'
			if (month > 12) validated = '12'
		}

		if (validated.length > 0) result += validated
		offset += part.length

		if (i < parts.length - 1 && offset <= digits.length) {
			result += separator
		}
	}

	if (result.replace(/\D/g, '').length === totalDigits) {
		const allDigits = result.replace(/\D/g, '')
		const dateObj: Record<string, number> = {}
		let off = 0
		for (const part of parts) {
			dateObj[part.type] = Number(allDigits.slice(off, off + part.length))
			off += part.length
		}
		const { dd, MM, yyyy } = dateObj as { dd: number; MM: number; yyyy: number }
		const digitFmt = DIGIT_FORMATS[fmt]
		const probe = parse(
			`${String(dd).padStart(2, '0')}${separator}${String(MM).padStart(2, '0')}${separator}${String(yyyy).padStart(4, '0')}`,
			digitFmt,
			new Date(),
		)
		if (!isValid(probe)) {
			const maxDay = new Date(yyyy, MM, 0).getDate()
			if (dd > maxDay) {
				const fixed = String(maxDay).padStart(2, '0')
				result = result.replace(/^(\d{2})/, fixed)
			}
		}
	}

	return result
}

function placeholderFromFormat(fmt: DateFormat): string {
	if (fmt === 'dd MMM yyyy') return 'dd mmm aaaa'
	if (fmt === 'dd MMMM yyyy') return 'dd mes aaaa'
	return fmt.replace(/dd/, 'dd').replace(/MM/, 'mm').replace(/yyyy/, 'aaaa')
}

export default function DateField({
	label,
	format: fmt = 'dd/MM/yyyy',
	value: controlledValue,
	defaultValue,
	onChange,
	className,
	id: externalId,
	error,
	required,
	...rest
}: DateFieldProps) {
	const autoId = useId()
	const id = externalId ?? autoId
	const errorId = `${id}-error`

	const [internalValue, setInternalValue] = useState<Date | null>(
		defaultValue ?? null,
	)
	const [draft, setDraft] = useState<string>(() =>
		formatDate(defaultValue ?? null, fmt),
	)

	const isControlled = controlledValue !== undefined
	const currentValue = isControlled ? controlledValue : internalValue

	const placeholder = useMemo(() => placeholderFromFormat(fmt), [fmt])

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const masked = mask(e.target.value, fmt)
			setDraft(masked)
			const date = parseDate(masked, fmt)
			if (date) {
				if (!isControlled) {
					setInternalValue(date)
				}
				onChange?.(date)
			}
		},
		[fmt, isControlled, onChange],
	)

	const handleBlur = useCallback(() => {
		const date = parseDate(draft, fmt)
		if (!isControlled) {
			setInternalValue(date)
		}
		setDraft(formatDate(date, fmt))
	}, [draft, fmt, isControlled])

	const ariaLabel = label ?? 'Fecha'

	return (
		<div className='d-flex flex-column gap-1 w-100'>
			{label && (
				<label htmlFor={id} className='form-label fw-semibold small mb-0'>
					{label}
					{required && <span className='text-danger ms-1'>*</span>}
				</label>
			)}
			<InputGroup>
				<input
					id={id}
					type='text'
					autoComplete='off'
					placeholder={placeholder}
					className={`form-control ${error ? 'is-invalid' : ''} ${className ?? ''}`}
					value={isControlled ? formatDate(currentValue, fmt) : draft}
					onChange={handleChange}
					onBlur={handleBlur}
					aria-label={!label ? ariaLabel : undefined}
					aria-required={required || undefined}
					aria-invalid={!!error || undefined}
					aria-describedby={error ? errorId : undefined}
					{...rest}
				/>
				<InputGroup.Text className='bg-transparent'>
					<Calendar size={16} className='text-muted' aria-hidden='true' />
				</InputGroup.Text>
			</InputGroup>
			{error && (
				<div id={errorId} className='invalid-feedback d-block'>
					{error}
				</div>
			)}
		</div>
	)
}
