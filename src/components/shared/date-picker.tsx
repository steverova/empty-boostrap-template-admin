import { Calendar as CalendarIcon, X } from 'lucide-react'
import { type ComponentProps, useCallback, useEffect, useRef, useState } from 'react'
import { Modal, Overlay, Popover } from 'react-bootstrap'
import Calendar from './calendar'

interface DatePickerProps extends ComponentProps<typeof Calendar> {
	align?: 'start' | 'end'
}

const CALENDAR_HEIGHT = 340

function useIsSmallScreen() {
	const [isSmall, setIsSmall] = useState(
		() => window.matchMedia('(max-width: 767.98px)').matches,
	)

	useEffect(() => {
		const mq = window.matchMedia('(max-width: 767.98px)')
		const handler = (e: MediaQueryListEvent) => setIsSmall(e.matches)
		mq.addEventListener('change', handler)
		return () => mq.removeEventListener('change', handler)
	}, [])

	return isSmall
}

function getScrollParent(el: HTMLElement | null): HTMLElement {
	while (el && el !== document.body) {
		const style = window.getComputedStyle(el)
		if (style.overflow === 'auto' || style.overflow === 'scroll' || style.overflowY === 'auto' || style.overflowY === 'scroll') {
			return el
		}
		el = el.parentElement
	}
	return document.documentElement
}

export default function DatePicker({ align = 'start', ...calendarProps }: DatePickerProps) {
	const [selectedDate, setSelectedDate] = useState<Date | null>(calendarProps.value ?? null)
	const [showCalendar, setShowCalendar] = useState(false)
	const triggerRef = useRef<HTMLDivElement>(null)
	const isSmallScreen = useIsSmallScreen()
	const [placement, setPlacement] = useState<'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'>(`bottom-${align}` as const)

	useEffect(() => {
		setSelectedDate(calendarProps.value ?? null)
	}, [calendarProps.value])

	const handleToggle = useCallback(() => {
		if (!showCalendar && triggerRef.current) {
			const scrollParent = getScrollParent(triggerRef.current)
			const triggerRect = triggerRef.current.getBoundingClientRect()
			const parentRect = scrollParent.getBoundingClientRect()
			const spaceBelow = parentRect.bottom - triggerRect.bottom
			const vertical = spaceBelow < CALENDAR_HEIGHT ? 'top' : 'bottom'
			setPlacement(`${vertical}-${align}` as 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end')
		}
		setShowCalendar((prev) => !prev)
	}, [showCalendar, align])

	const handleChange = useCallback(
		(date: Date | null) => {
			setSelectedDate(date)
			calendarProps.onChange?.(date as Date)
			setShowCalendar(false)
			triggerRef.current?.focus()
		},
		[calendarProps.onChange],
	)

	const handleRangeChange = useCallback(
		(start: Date | null, end: Date | null) => {
			calendarProps.onRangeChange?.(start, end)
			if (start && end) {
				setShowCalendar(false)
				triggerRef.current?.focus()
			}
		},
		[calendarProps.onRangeChange],
	)

	const handleMultipleChange = useCallback(
		(dates: Date[]) => {
			calendarProps.onMultipleChange?.(dates)
		},
		[calendarProps.onMultipleChange],
	)

	const handleClear = useCallback(() => {
		setSelectedDate(null)
		calendarProps.onChange?.(null as unknown as Date)
		setShowCalendar(false)
		triggerRef.current?.focus()
	}, [calendarProps.onChange])

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === 'Escape' && showCalendar) {
				e.preventDefault()
				setShowCalendar(false)
				triggerRef.current?.focus()
			}
		},
		[showCalendar],
	)

	const displayValue = calendarProps.mode === 'range'
		? calendarProps.rangeStart
			? calendarProps.rangeEnd
				? `${calendarProps.rangeStart.toLocaleDateString('es-ES')} – ${calendarProps.rangeEnd.toLocaleDateString('es-ES')}`
				: calendarProps.rangeStart.toLocaleDateString('es-ES')
			: null
		: calendarProps.mode === 'multiple'
			? calendarProps.selectedDates?.length
				? `${calendarProps.selectedDates.length} fecha(s)`
				: null
			: selectedDate?.toLocaleDateString('es-ES')

	return (
		<div onKeyDown={handleKeyDown} className='position-relative w-100'>
			<div
				ref={triggerRef}
				role='combobox'
				aria-expanded={showCalendar}
				aria-haspopup='dialog'
				aria-label='Seleccionar fecha'
				tabIndex={0}
				className='form-control d-flex align-items-center justify-content-between'
				style={{ cursor: 'pointer' }}
				onClick={handleToggle}
				onKeyDown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault()
						handleToggle()
					}
				}}
			>
				<span className={displayValue ? '' : 'text-muted'}>
					{displayValue ?? calendarProps.placeholder ?? 'Selecciona una fecha'}
				</span>
				<span className='d-flex align-items-center gap-1'>
					{displayValue && (
						<X
							size={16}
							className='text-muted'
							role='button'
							tabIndex={-1}
							onClick={(e) => {
								e.stopPropagation()
								handleClear()
							}}
						/>
					)}
					<CalendarIcon className='text-muted' />
				</span>
			</div>

			{isSmallScreen ? (
				<Modal
					show={showCalendar}
					onHide={() => setShowCalendar(false)}
					centered
					contentClassName='bg-transparent border-0 shadow-none d-flex justify-content-center align-items-center'
					dialogClassName='my-0'
				>
					<Modal.Body className='p-0 d-flex justify-content-center'>
						<Calendar
							{...calendarProps}
							value={selectedDate}
							onChange={handleChange}
							onRangeChange={handleRangeChange}
							onMultipleChange={handleMultipleChange}
						/>
					</Modal.Body>
				</Modal>
			) : (
				<Overlay
					show={showCalendar}
					target={triggerRef.current}
					placement={placement}
					onHide={() => setShowCalendar(false)}
					rootClose
				>
					<Popover className='no-arrow'>
						<Popover.Body className='p-0'>
							<Calendar
								{...calendarProps}
								value={selectedDate}
								onChange={handleChange}
								onRangeChange={handleRangeChange}
								onMultipleChange={handleMultipleChange}
							/>
						</Popover.Body>
					</Popover>
				</Overlay>
			)}
		</div>
	)
}
