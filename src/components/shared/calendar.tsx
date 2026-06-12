import {
	addDays,
	addMonths,
	endOfMonth,
	endOfWeek,
	format,
	getMonth,
	getWeek,
	isAfter,
	isBefore,
	isSameDay,
	isSameMonth,
	isWeekend,
	type Locale,
	setMonth,
	setYear,
	startOfMonth,
	startOfWeek,
	subMonths,
} from 'date-fns'
import { es } from 'date-fns/locale'
import {
	CalendarIcon,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronUp,
	X,
} from 'lucide-react'
import {
	Fragment,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'

const YEAR_PAGE_SIZE = 16
const DEFAULT_YEAR_RANGE = 100
const MONTHS = Array.from({ length: 12 }, (_, i) => i)

function isDayDisabled(
	date: Date,
	minDate?: Date,
	maxDate?: Date,
	disabledDates?: Date[],
	disableWeekends?: boolean,
): boolean {
	if (disableWeekends && isWeekend(date)) return true
	if (minDate && isBefore(date, startOfDay(minDate))) return true
	if (maxDate && isAfter(date, endOfDay(maxDate))) return true
	if (disabledDates?.some((d) => isSameDay(date, d))) return true
	return false
}

function startOfDay(date: Date): Date {
	const d = new Date(date)
	d.setHours(0, 0, 0, 0)
	return d
}

function endOfDay(date: Date): Date {
	const d = new Date(date)
	d.setHours(23, 59, 59, 999)
	return d
}

function isInRange(
	date: Date,
	rangeStart: Date | null,
	rangeEnd: Date | null,
): boolean {
	if (!rangeStart || !rangeEnd) return false
	return isAfter(date, rangeStart) && isBefore(date, rangeEnd)
}

export type CalendarMode = 'single' | 'range' | 'multiple'

export interface CalendarProps {
	value?: Date | null
	onChange?: (date: Date) => void
	locale?: Locale
	minDate?: Date
	maxDate?: Date
	disabledDates?: Date[]
	weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
	showOutsideDays?: boolean
	showWeeks?: boolean
	onSelectWeek?: (dates: Date[]) => void
	compact?: boolean
	onMonthChange?: (date: Date) => void
	mode?: CalendarMode
	rangeStart?: Date | null
	rangeEnd?: Date | null
	onRangeChange?: (start: Date | null, end: Date | null) => void
	selectedDates?: Date[]
	onMultipleChange?: (dates: Date[]) => void
	disableWeekends?: boolean
	showToday?: boolean
	showClear?: boolean
	monthView?: boolean
	keyboardNav?: boolean
	placeholder?: string
}

export default function Calendar({
	value,
	onChange,
	locale = es,
	minDate,
	maxDate,
	disabledDates,
	weekStartsOn = 0,
	showOutsideDays = true,
	showWeeks = false,
	onSelectWeek,
	compact = false,
	onMonthChange,
	mode = 'single',
	rangeStart,
	rangeEnd,
	onRangeChange,
	selectedDates = [],
	onMultipleChange,
	disableWeekends = false,
	showToday = false,
	showClear = false,
	monthView = false,
	keyboardNav = false,
	placeholder,
}: CalendarProps) {
	const [currentDate, setCurrentDate] = useState(value ?? new Date())
	const [view, setView] = useState<'calendar' | 'year' | 'month'>(
		monthView ? 'month' : 'calendar',
	)

	const currentYear = currentDate.getFullYear()
	const minYear = minDate?.getFullYear() ?? currentYear - DEFAULT_YEAR_RANGE
	const maxYear = maxDate?.getFullYear() ?? currentYear + 5

	const [yearPageStart, setYearPageStart] = useState(() => {
		const range = maxYear - minYear + 1
		if (range <= YEAR_PAGE_SIZE) {
			return minYear
		}
		const page = Math.floor(currentYear / YEAR_PAGE_SIZE) * YEAR_PAGE_SIZE
		const maxPage = maxYear - YEAR_PAGE_SIZE + 1
		return Math.min(Math.max(minYear, page), maxPage)
	})

	const [selectedWeek, setSelectedWeek] = useState<number | null>(null)
	const [focusedDate, setFocusedDate] = useState<Date | null>(null)
	const [internalRangeStart, setInternalRangeStart] = useState<Date | null>(
		null,
	)
	const [internalRangeEnd, setInternalRangeEnd] = useState<Date | null>(null)
	const [internalSelectedDates, setInternalSelectedDates] = useState<Date[]>([])
	const [selectingEnd, setSelectingEnd] = useState(false)

	const cardRef = useRef<HTMLDivElement>(null)

	const effectiveRangeStart = rangeStart ?? internalRangeStart
	const effectiveRangeEnd = rangeEnd ?? internalRangeEnd
	const effectiveSelectedDates =
		selectedDates.length > 0 ? selectedDates : internalSelectedDates

	const weekdays = useMemo(
		() =>
			Array.from({ length: 7 }, (_, i) =>
				format(addDays(startOfWeek(new Date(), { weekStartsOn }), i), 'EEE', {
					locale,
				}),
			),
		[locale, weekStartsOn],
	)

	const monthStart = startOfMonth(currentDate)
	const monthEnd = endOfMonth(monthStart)
	const calendarStart = startOfWeek(monthStart, { weekStartsOn })
	const calendarEnd = endOfWeek(monthEnd, { weekStartsOn })

	const days: Date[] = []
	let day = calendarStart
	while (day <= calendarEnd) {
		days.push(day)
		day = addDays(day, 1)
	}

	const weeks: Date[][] = []
	for (let i = 0; i < days.length; i += 7) {
		weeks.push(days.slice(i, i + 7))
	}

	const handleSelectWeek = (weekDays: Date[]) => {
		const weekNum = getWeek(weekDays[0], { weekStartsOn, locale })
		setSelectedWeek(weekNum === selectedWeek ? null : weekNum)
		onSelectWeek?.(weekNum === selectedWeek ? [] : weekDays)
	}

	const handlePrevMonth = () => {
		const next = subMonths(currentDate, 1)
		setCurrentDate(next)
		onMonthChange?.(next)
	}

	const handleNextMonth = () => {
		const next = addMonths(currentDate, 1)
		setCurrentDate(next)
		onMonthChange?.(next)
	}

	const years = Array.from(
		{ length: YEAR_PAGE_SIZE },
		(_, i) => yearPageStart + i,
	).filter((y) => y >= minYear && y <= maxYear)

	const canGoPrevYears = yearPageStart > minYear
	const canGoNextYears = yearPageStart + YEAR_PAGE_SIZE <= maxYear

	const handleSelectYear = (year: number) => {
		const next = setYear(currentDate, year)
		setCurrentDate(next)
		setView(monthView ? 'month' : 'calendar')
		onMonthChange?.(next)
	}

	const handleSelectMonth = (month: number) => {
		const next = setMonth(currentDate, month)
		setCurrentDate(next)
		setView('calendar')
		onMonthChange?.(next)
	}

	const handleDayClick = useCallback(
		(d: Date) => {
			if (mode === 'range') {
				if (!selectingEnd || !effectiveRangeStart) {
					setInternalRangeStart(d)
					setInternalRangeEnd(null)
					setSelectingEnd(true)
					onRangeChange?.(d, null)
				} else {
					const start = isBefore(d, effectiveRangeStart)
						? d
						: effectiveRangeStart
					const end = isBefore(d, effectiveRangeStart) ? effectiveRangeStart : d
					setInternalRangeEnd(end)
					setSelectingEnd(false)
					onRangeChange?.(start, end)
				}
			} else if (mode === 'multiple') {
				const exists = effectiveSelectedDates.some((sd) => isSameDay(sd, d))
				const next = exists
					? effectiveSelectedDates.filter((sd) => !isSameDay(sd, d))
					: [...effectiveSelectedDates, d]
				setInternalSelectedDates(next)
				onMultipleChange?.(next)
			} else {
				onChange?.(d)
			}
		},
		[
			mode,
			selectingEnd,
			effectiveRangeStart,
			effectiveSelectedDates,
			onChange,
			onRangeChange,
			onMultipleChange,
		],
	)

	const handleToday = () => {
		const today = new Date()
		setCurrentDate(today)
		handleDayClick(today)
	}

	const handleClear = () => {
		if (mode === 'range') {
			setInternalRangeStart(null)
			setInternalRangeEnd(null)
			setSelectingEnd(false)
			onRangeChange?.(null, null)
		} else if (mode === 'multiple') {
			setInternalSelectedDates([])
			onMultipleChange?.([])
		} else {
			onChange?.(null as unknown as Date)
		}
	}

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (!keyboardNav) return

			const base = focusedDate ?? value ?? new Date()
			let next: Date | null = null

			switch (e.key) {
				case 'ArrowLeft':
					next = addDays(base, -1)
					break
				case 'ArrowRight':
					next = addDays(base, 1)
					break
				case 'ArrowUp':
					next = addDays(base, -7)
					break
				case 'ArrowDown':
					next = addDays(base, 7)
					break
				case 'Enter':
				case ' ':
					e.preventDefault()
					if (focusedDate) handleDayClick(focusedDate)
					return
				default:
					return
			}

			e.preventDefault()
			if (next) {
				setFocusedDate(next)
				if (!isSameMonth(next, currentDate)) {
					setCurrentDate(next)
					onMonthChange?.(next)
				}
			}
		},
		[
			keyboardNav,
			focusedDate,
			value,
			currentDate,
			handleDayClick,
			onMonthChange,
		],
	)

	useEffect(() => {
		if (keyboardNav && cardRef.current) {
			cardRef.current.focus()
		}
	}, [keyboardNav])

	const prevMonthDisabled =
		minDate && isBefore(subMonths(monthStart, 1), startOfMonth(minDate))
	const nextMonthDisabled =
		maxDate && isAfter(addMonths(monthStart, 1), startOfMonth(maxDate))

	const daySize = compact ? 32 : 36
	const gap = compact ? 1 : 2

	const isSelected = (d: Date) => {
		if (mode === 'range') {
			return (
				(effectiveRangeStart && isSameDay(d, effectiveRangeStart)) ||
				(effectiveRangeEnd && isSameDay(d, effectiveRangeEnd))
			)
		}
		if (mode === 'multiple') {
			return effectiveSelectedDates.some((sd) => isSameDay(sd, d))
		}
		return value && isSameDay(d, value)
	}

	const isInRangeDate = (d: Date) => {
		if (mode !== 'range') return false
		if (effectiveRangeStart && effectiveRangeEnd) {
			return isInRange(d, effectiveRangeStart, effectiveRangeEnd)
		}
		if (selectingEnd && effectiveRangeStart) {
			return isAfter(d, effectiveRangeStart)
		}
		return false
	}

	const renderDay = (d: Date) => {
		const inMonth = isSameMonth(d, currentDate)
		const selected = isSelected(d)
		const inRange = isInRangeDate(d)
		const isToday = isSameDay(d, new Date())
		const disabled = isDayDisabled(
			d,
			minDate,
			maxDate,
			disabledDates,
			disableWeekends,
		)
		const hidden = !showOutsideDays && !inMonth
		const focused = focusedDate && isSameDay(d, focusedDate)

		if (hidden) {
			return (
				<div
					key={d.toISOString()}
					style={{ width: daySize, height: daySize }}
				/>
			)
		}

		const dayLabel = format(d, "d 'de' MMMM 'de' yyyy", { locale })

		return (
			<button
				type='button'
				key={d.toISOString()}
				aria-label={dayLabel}
				aria-current={isToday ? 'date' : undefined}
				aria-disabled={disabled || undefined}
				className={`btn btn-sm rounded-circle ${
					selected
						? 'btn-primary'
						: inRange
							? 'btn-primary bg-opacity-25 text-primary border-primary'
							: isToday
								? 'btn-outline-primary'
								: ''
				}`}
				style={{
					opacity: inMonth && !disabled ? 1 : 0.35,
					width: daySize,
					height: daySize,
					...(inRange &&
						!selected && {
							backgroundColor: 'rgba(var(--bs-primary-rgb), 0.15)',
							borderRadius: 0,
						}),
					...(focused && {
						boxShadow: '0 0 0 2px var(--bs-focus-ring-color)',
					}),
				}}
				disabled={disabled}
				onClick={() => handleDayClick(d)}
			>
				{format(d, 'd')}
			</button>
		)
	}

	return (
		<div
			ref={cardRef}
			className='card'
			role='application'
			aria-label='Calendario'
			style={{ width: compact ? 300 : 350 }}
			tabIndex={keyboardNav ? 0 : -1}
			onKeyDown={handleKeyDown}
		>
			<div className='card-header d-flex justify-content-between align-items-center'>
				{view === 'calendar' && (
					<>
						<button
							type='button'
							className='btn btn-sm btn-outline-secondary'
							aria-label='Mes anterior'
							onClick={handlePrevMonth}
							disabled={prevMonthDisabled}
						>
							<ChevronLeft size={compact ? 16 : 18} />
						</button>
						<button
							type='button'
							className='btn btn-link text-decoration-none fw-bold'
							aria-label='Seleccionar año'
							onClick={() => setView('year')}
						>
							{format(currentDate, 'MMMM yyyy', { locale })}
							<ChevronDown className='ms-1' size={compact ? 14 : 16} />
						</button>
						<button
							type='button'
							className='btn btn-sm btn-outline-secondary'
							aria-label='Mes siguiente'
							onClick={handleNextMonth}
							disabled={nextMonthDisabled}
						>
							<ChevronRight size={compact ? 16 : 18} />
						</button>
					</>
				)}
				{view === 'year' && (
					<>
						<button
							type='button'
							className='btn btn-sm btn-outline-secondary'
							aria-label='Rango de años anterior'
							disabled={!canGoPrevYears}
							onClick={() => setYearPageStart(yearPageStart - YEAR_PAGE_SIZE)}
						>
							<ChevronLeft size={compact ? 16 : 18} />
						</button>
						<button
							type='button'
							className='btn btn-link text-decoration-none fw-bold'
							aria-label='Seleccionar mes'
							onClick={() => setView(monthView ? 'month' : 'calendar')}
						>
							{years[0]} – {years[years.length - 1]}
							<ChevronUp className='ms-1' size={compact ? 14 : 16} />
						</button>
						<button
							type='button'
							className='btn btn-sm btn-outline-secondary'
							aria-label='Rango de años siguiente'
							disabled={!canGoNextYears}
							onClick={() => setYearPageStart(yearPageStart + YEAR_PAGE_SIZE)}
						>
							<ChevronRight size={compact ? 16 : 18} />
						</button>
					</>
				)}
				{view === 'month' && (
					<>
						<button
							type='button'
							className='btn btn-sm btn-outline-secondary'
							aria-label='Año anterior'
							onClick={() => setCurrentDate(subMonths(currentDate, 1))}
						>
							<ChevronLeft size={compact ? 16 : 18} />
						</button>
						<button
							type='button'
							className='btn btn-link text-decoration-none fw-bold'
							aria-label='Seleccionar año'
							onClick={() => setView('year')}
						>
							{format(currentDate, 'yyyy', { locale })}
							<ChevronDown className='ms-1' size={compact ? 14 : 16} />
						</button>
						<button
							type='button'
							className='btn btn-sm btn-outline-secondary'
							aria-label='Año siguiente'
							onClick={() => setCurrentDate(addMonths(currentDate, 1))}
						>
							<ChevronRight size={compact ? 16 : 18} />
						</button>
					</>
				)}
			</div>
			<div className='card-body p-2' style={{ minHeight: compact ? 260 : 290 }}>
				{view === 'calendar' && (
					<div
						aria-live='polite'
						style={{
							display: 'grid',
							gridTemplateColumns: showWeeks
								? 'repeat(8, 1fr)'
								: 'repeat(7, 1fr)',
							gap,
						}}
					>
						{showWeeks && <div />}
						{weekdays.map((wd) => (
							<div
								key={wd}
								className='text-center text-muted small fw-bold py-1'
							>
								{wd}
							</div>
						))}

						{showWeeks
							? weeks.map((weekDays) => {
									const weekNum = getWeek(weekDays[0], {
										weekStartsOn,
										locale,
									})
									const isActive = selectedWeek === weekNum

									return (
										<Fragment key={weekNum}>
											<button
												type='button'
												aria-label={`Semana ${weekNum}`}
												aria-pressed={isActive}
												className={`btn btn-sm py-0 ${isActive ? 'btn-primary' : 'text-muted'}`}
												style={{ fontSize: '0.7rem' }}
												onClick={() => handleSelectWeek(weekDays)}
											>
												{weekNum}
											</button>
											{weekDays.map((d) => renderDay(d))}
										</Fragment>
									)
								})
							: days.map((d) => renderDay(d))}
					</div>
				)}

				{view === 'year' && (
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(4, 1fr)',
							gap: compact ? 3 : 4,
						}}
					>
						{years.map((y) => {
							const isCurrent = y === currentDate.getFullYear()
							return (
								<button
									type='button'
									key={y}
									aria-current={(isCurrent ? 'year' : undefined) as any}
									className={`btn btn-sm rounded-pill ${
										isCurrent ? 'btn-primary' : ''
									}`}
									onClick={() => handleSelectYear(y)}
								>
									{y}
								</button>
							)
						})}
					</div>
				)}

				{view === 'month' && (
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(3, 1fr)',
							gap: compact ? 3 : 4,
						}}
					>
						{MONTHS.map((m) => {
							const isCurrent = m === getMonth(currentDate)
							const monthLabel = format(new Date(2000, m), 'MMMM', {
								locale,
							})
							return (
								<button
									type='button'
									key={m}
									aria-current={(isCurrent ? 'month' : undefined) as any}
									aria-label={monthLabel}
									className={`btn btn-sm rounded-pill ${
										isCurrent ? 'btn-primary' : ''
									}`}
									onClick={() => handleSelectMonth(m)}
								>
									{format(new Date(2000, m), 'MMM', { locale })}
								</button>
							)
						})}
					</div>
				)}
			</div>

			{(showToday || showClear) && (
				<div className='card-footer d-flex justify-content-end gap-2 py-1'>
					{showClear && (
						<button
							type='button'
							className='btn btn-sm btn-outline-danger'
							aria-label='Limpiar selección'
							onClick={handleClear}
						>
							<X size={14} className='me-1' />
							Limpiar
						</button>
					)}
					{showToday && (
						<button
							type='button'
							className='btn btn-sm btn-outline-primary'
							aria-label='Ir a hoy'
							onClick={handleToday}
						>
							<CalendarIcon size={14} className='me-1' />
							Hoy
						</button>
					)}
				</div>
			)}

			{mode === 'single' && !value && placeholder && (
				<div className='card-footer text-muted small py-1'>{placeholder}</div>
			)}
		</div>
	)
}
