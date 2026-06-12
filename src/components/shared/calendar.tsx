import {
	addDays,
	addMonths,
	endOfMonth,
	endOfWeek,
	format,
	getWeek,
	isAfter,
	isBefore,
	isSameDay,
	isSameMonth,
	type Locale,
	setYear,
	startOfMonth,
	startOfWeek,
	subMonths,
} from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react'
import { Fragment, useMemo, useState } from 'react'

const YEAR_PAGE_SIZE = 16

function isDayDisabled(
	date: Date,
	minDate?: Date,
	maxDate?: Date,
	disabledDates?: Date[],
): boolean {
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
}: CalendarProps) {
	const [currentDate, setCurrentDate] = useState(value ?? new Date())
	const [view, setView] = useState<'calendar' | 'year'>('calendar')
	const [yearPageStart, setYearPageStart] = useState(
		Math.floor(currentDate.getFullYear() / YEAR_PAGE_SIZE) * YEAR_PAGE_SIZE,
	)
	const [selectedWeek, setSelectedWeek] = useState<number | null>(null)

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
	)

	const handleSelectYear = (year: number) => {
		const next = setYear(currentDate, year)
		setCurrentDate(next)
		setView('calendar')
		onMonthChange?.(next)
	}

	const prevMonthDisabled =
		minDate && isBefore(subMonths(monthStart, 1), startOfMonth(minDate))
	const nextMonthDisabled =
		maxDate && isAfter(addMonths(monthStart, 1), startOfMonth(maxDate))

	const daySize = compact ? 32 : 36
	const gap = compact ? 1 : 2

	return (
		<div className='card' style={{ width: compact ? 300 : 350 }}>
			<div className='card-header d-flex justify-content-between align-items-center'>
				{view === 'calendar' ? (
					<>
						<button
							type='button'
							className='btn btn-sm btn-outline-secondary'
							onClick={handlePrevMonth}
							disabled={prevMonthDisabled}
						>
							<ChevronLeft size={compact ? 16 : 18} />
						</button>
						<button
							type='button'
							className='btn btn-link text-decoration-none fw-bold'
							onClick={() => setView('year')}
						>
							{format(currentDate, 'MMMM yyyy', { locale })}
							<ChevronDown className='ms-1' size={compact ? 14 : 16} />
						</button>
						<button
							type='button'
							className='btn btn-sm btn-outline-secondary'
							onClick={handleNextMonth}
							disabled={nextMonthDisabled}
						>
							<ChevronRight size={compact ? 16 : 18} />
						</button>
					</>
				) : (
					<>
						<button
							type='button'
							className='btn btn-sm btn-outline-secondary'
							onClick={() => setYearPageStart(yearPageStart - YEAR_PAGE_SIZE)}
						>
							<ChevronLeft size={compact ? 16 : 18} />
						</button>
						<button
							type='button'
							className='btn btn-link text-decoration-none fw-bold'
							onClick={() => setView('calendar')}
						>
							{yearPageStart} – {yearPageStart + YEAR_PAGE_SIZE - 1}
							<ChevronUp className='ms-1' size={compact ? 14 : 16} />
						</button>
						<button
							type='button'
							className='btn btn-sm btn-outline-secondary'
							onClick={() => setYearPageStart(yearPageStart + YEAR_PAGE_SIZE)}
						>
							<ChevronRight size={compact ? 16 : 18} />
						</button>
					</>
				)}
			</div>
			<div className='card-body p-2' style={{ minHeight: compact ? 260 : 290 }}>
				{view === 'calendar' ? (
					<div
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
												className={`btn btn-sm py-0 ${isActive ? 'btn-primary' : 'text-muted'}`}
												style={{ fontSize: '0.7rem' }}
												onClick={() => handleSelectWeek(weekDays)}
											>
												{weekNum}
											</button>
											{weekDays.map((d) => {
												const inMonth = isSameMonth(d, currentDate)
												const isSelected = value && isSameDay(d, value)
												const isToday = isSameDay(d, new Date())
												const disabled = isDayDisabled(
													d,
													minDate,
													maxDate,
													disabledDates,
												)
												const hidden = !showOutsideDays && !inMonth

												if (hidden) {
													return (
														<div
															key={d.toISOString()}
															style={{ width: daySize, height: daySize }}
														/>
													)
												}

												return (
													<button
														type='button'
														key={d.toISOString()}
														className={`btn btn-sm rounded-circle ${
															isSelected
																? 'btn-primary'
																: isToday
																	? 'btn-outline-primary'
																	: ''
														}`}
														style={{
															opacity: inMonth && !disabled ? 1 : 0.35,
															width: daySize,
															height: daySize,
														}}
														disabled={disabled}
														onClick={() => onChange?.(d)}
													>
														{format(d, 'd')}
													</button>
												)
											})}
										</Fragment>
									)
								})
							: days.map((d) => {
									const inMonth = isSameMonth(d, currentDate)
									const isSelected = value && isSameDay(d, value)
									const isToday = isSameDay(d, new Date())
									const disabled = isDayDisabled(
										d,
										minDate,
										maxDate,
										disabledDates,
									)
									const hidden = !showOutsideDays && !inMonth

									if (hidden) {
										return (
											<div
												key={d.toISOString()}
												style={{ width: daySize, height: daySize }}
											/>
										)
									}

									return (
										<button
											type='button'
											key={d.toISOString()}
											className={`btn btn-sm rounded-circle ${
												isSelected
													? 'btn-primary'
													: isToday
														? 'btn-outline-primary'
														: ''
											}`}
											style={{
												opacity: inMonth && !disabled ? 1 : 0.35,
												width: daySize,
												height: daySize,
											}}
											disabled={disabled}
											onClick={() => onChange?.(d)}
										>
											{format(d, 'd')}
										</button>
									)
								})}
					</div>
				) : (
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
			</div>
		</div>
	)
}
