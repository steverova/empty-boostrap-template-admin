import {
	addDays,
	addMonths,
	addWeeks,
	endOfMonth,
	endOfWeek,
	format,
	isAfter,
	isBefore,
	isSameDay,
	isSameMonth,
	startOfMonth,
	startOfWeek,
	subMonths,
	subWeeks,
} from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { Button } from 'react-bootstrap'
import {
	calendarContainer,
	calendarDay,
	calendarDayHeader,
	calendarDayInRange,
	calendarDayOutside,
	calendarDayRangeEnd,
	calendarDayRangeStart,
	calendarDayToday,
	calendarGrid,
	calendarHeader,
	calendarNav,
	eventPill,
	eventPillContinuation,
	eventPillEnd,
} from './full-calendar.css'

export type CalendarEvent = {
	id: string
	title: string
	date: Date
	endDate?: Date
	color?: string
	allDay?: boolean
}

export type DateRange = {
	start: Date
	end: Date
}

type ViewMode = 'month' | 'week' | 'day'

interface FullCalendarProps {
	events?: CalendarEvent[]
	view?: ViewMode
	date?: Date
	onDateChange?: (date: Date) => void
	onEventClick?: (event: CalendarEvent) => void
	onDayClick?: (date: Date) => void
	onRangeSelect?: (range: DateRange | null) => void
	selectedRange?: DateRange | null
	locale?: typeof es
	weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
	enableRangeSelect?: boolean
}

function isDateInRange(date: Date, range: DateRange): boolean {
	const start = range.start < range.end ? range.start : range.end
	const end = range.start < range.end ? range.end : range.start
	return (
		(isSameDay(date, start) || isAfter(date, start)) &&
		(isSameDay(date, end) || isBefore(date, end))
	)
}

function isRangeStart(date: Date, range: DateRange): boolean {
	const start = range.start < range.end ? range.start : range.end
	return isSameDay(date, start)
}

function isRangeEnd(date: Date, range: DateRange): boolean {
	const end = range.start < range.end ? range.end : range.start
	return isSameDay(date, end)
}

export default function FullCalendar({
	events = [],
	view: controlledView,
	date: controlledDate,
	onDateChange,
	onEventClick,
	onDayClick,
	onRangeSelect,
	selectedRange: controlledRange,
	locale = es,
	weekStartsOn = 1,
	enableRangeSelect = true,
}: FullCalendarProps) {
	const [internalDate, setInternalDate] = useState(new Date())
	const [internalRange, setInternalRange] = useState<DateRange | null>(null)
	const [rangeStart, setRangeStart] = useState<Date | null>(null)
	const [hoveredEvent, setHoveredEvent] = useState<CalendarEvent | null>(null)

	const dragRef = useRef(false)

	const currentDate = controlledDate ?? internalDate
	const currentView = controlledView ?? 'month'
	const selectedRange = controlledRange ?? internalRange

	const setCurrentDate = (date: Date) => {
		if (onDateChange) onDateChange(date)
		else setInternalDate(date)
	}

	const setSelectedRange = (range: DateRange | null) => {
		if (onRangeSelect) onRangeSelect(range)
		else setInternalRange(range)
	}

	const monthStart = startOfMonth(currentDate)
	const monthEnd = endOfMonth(currentDate)
	const calendarStart = startOfWeek(monthStart, { weekStartsOn })
	const calendarEnd = endOfWeek(monthEnd, { weekStartsOn })

	const weeks = useMemo(() => {
		const result: Date[][] = []
		let day = calendarStart
		while (day <= calendarEnd) {
			const week: Date[] = []
			for (let i = 0; i < 7; i++) {
				week.push(day)
				day = addDays(day, 1)
			}
			result.push(week)
		}
		return result
	}, [calendarStart, calendarEnd])

	const weekDays = useMemo(() => {
		const days: Date[] = []
		let day = startOfWeek(currentDate, { weekStartsOn })
		for (let i = 0; i < 7; i++) {
			days.push(day)
			day = addDays(day, 1)
		}
		return days
	}, [currentDate, weekStartsOn])

	const hours = Array.from({ length: 24 }, (_, i) => i)

	const getEventsForDate = (date: Date) =>
		events.filter((e) => {
			if (isSameDay(e.date, date)) return true
			if (e.endDate) {
				const start = e.date < e.endDate ? e.date : e.endDate
				const end = e.date < e.endDate ? e.endDate : e.date
				return (
					(isSameDay(date, start) || isAfter(date, start)) &&
					(isSameDay(date, end) || isBefore(date, end))
				)
			}
			return false
		})

	const isEventStart = (event: CalendarEvent, date: Date) =>
		isSameDay(event.date, date)
	const isEventEnd = (event: CalendarEvent, date: Date) =>
		event.endDate ? isSameDay(event.endDate, date) : false

	const navigatePrev = () => {
		if (currentView === 'month') setCurrentDate(subMonths(currentDate, 1))
		else if (currentView === 'week') setCurrentDate(subWeeks(currentDate, 1))
		else setCurrentDate(addDays(currentDate, -1))
	}

	const navigateNext = () => {
		if (currentView === 'month') setCurrentDate(addMonths(currentDate, 1))
		else if (currentView === 'week') setCurrentDate(addWeeks(currentDate, 1))
		else setCurrentDate(addDays(currentDate, 1))
	}

	const navigateToday = () => setCurrentDate(new Date())

	const handleDayMouseDown = useCallback(
		(date: Date) => {
			if (!enableRangeSelect) return
			dragRef.current = true
			setRangeStart(date)
		},
		[enableRangeSelect],
	)

	const handleDayMouseEnter = useCallback(
		(date: Date) => {
			if (!enableRangeSelect || !dragRef.current || !rangeStart) return
			setSelectedRange({ start: rangeStart, end: date })
		},
		[enableRangeSelect, rangeStart],
	)

	const handleDayMouseUp = useCallback(
		(date: Date) => {
			if (!enableRangeSelect || !dragRef.current || !rangeStart) {
				dragRef.current = false
				return
			}
			dragRef.current = false
			const range: DateRange = { start: rangeStart, end: date }
			setSelectedRange(range)
			setRangeStart(null)
		},
		[enableRangeSelect, rangeStart],
	)

	const handleDayClick = useCallback(
		(date: Date, e: React.MouseEvent) => {
			if (e.shiftKey && selectedRange && enableRangeSelect) {
				setSelectedRange({ start: selectedRange.start, end: date })
				return
			}
			onDayClick?.(date)
		},
		[onDayClick, selectedRange, enableRangeSelect],
	)

	const headerTitle = () => {
		if (currentView === 'month')
			return format(currentDate, 'MMMM yyyy', { locale })
		if (currentView === 'week')
			return `${format(weekDays[0], 'd MMM', { locale })} – ${format(weekDays[6], 'd MMM yyyy', { locale })}`
		return format(currentDate, 'EEEE d MMMM yyyy', { locale })
	}

	const today = new Date()

	const getDayClasses = (
		day: Date,
		isCurrentMonth: boolean,
		isToday: boolean,
	) => {
		const classes = [calendarDay]
		if (!isCurrentMonth) classes.push(calendarDayOutside)
		if (isToday) classes.push(calendarDayToday)
		if (selectedRange) {
			if (isRangeStart(day, selectedRange)) classes.push(calendarDayRangeStart)
			else if (isRangeEnd(day, selectedRange)) classes.push(calendarDayRangeEnd)
			else if (isDateInRange(day, selectedRange))
				classes.push(calendarDayInRange)
		}
		return classes.join(' ')
	}

	if (currentView === 'day') {
		const dayEvents = getEventsForDate(currentDate)
		return (
			<div className={`${calendarContainer} bg-body shadow-sm`}>
				<div className={calendarHeader}>
					<div className={calendarNav}>
						<Button
							variant='outline-secondary'
							size='sm'
							onClick={navigatePrev}
						>
							<ChevronLeft size={16} />
						</Button>
						<h5 className='mb-0 mx-2 text-nowrap'>{headerTitle()}</h5>
						<Button
							variant='outline-secondary'
							size='sm'
							onClick={navigateNext}
						>
							<ChevronRight size={16} />
						</Button>
						<Button
							variant='outline-secondary'
							size='sm'
							onClick={navigateToday}
							className='ms-1 d-none d-sm-inline-block'
						>
							Hoy
						</Button>
					</div>
				</div>
				<div className={calendarGrid}>
					<div style={{ display: 'grid', gridTemplateColumns: '60px 1fr' }}>
						{hours.map((hour) => (
							<div key={hour} style={{ display: 'contents' }}>
								<div
									style={{
										padding: '4px 8px',
										fontSize: '0.75rem',
										color: '#6c757d',
										textAlign: 'right',
										borderBottom: '1px solid #e9ecef',
									}}
								>
									{`${hour.toString().padStart(2, '0')}:00`}
								</div>
								<div
									style={{
										borderBottom: '1px solid #e9ecef',
										borderLeft: '1px solid #e9ecef',
										minHeight: 48,
										position: 'relative',
									}}
									role='button'
									tabIndex={0}
									onClick={() => onDayClick?.(currentDate)}
								>
									{dayEvents
										.filter((e) => e.date.getHours() === hour)
										.map((event) => (
											<div
												key={event.id}
												className={eventPill}
												style={{ backgroundColor: event.color || '#0d6efd' }}
												role='button'
												tabIndex={0}
												onClick={(e) => {
													e.stopPropagation()
													onEventClick?.(event)
												}}
											>
												{event.title}
											</div>
										))}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		)
	}

	if (currentView === 'week') {
		return (
			<div className={`${calendarContainer} bg-body shadow-sm`}>
				<div className={calendarHeader}>
					<div className={calendarNav}>
						<Button
							variant='outline-secondary'
							size='sm'
							onClick={navigatePrev}
						>
							<ChevronLeft size={16} />
						</Button>
						<h5 className='mb-0 mx-2 text-nowrap'>{headerTitle()}</h5>
						<Button
							variant='outline-secondary'
							size='sm'
							onClick={navigateNext}
						>
							<ChevronRight size={16} />
						</Button>
						<Button
							variant='outline-secondary'
							size='sm'
							onClick={navigateToday}
							className='ms-1 d-none d-sm-inline-block'
						>
							Hoy
						</Button>
					</div>
				</div>
				<div className={calendarGrid}>
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: `60px repeat(7, 1fr)`,
						}}
					>
						<div />
						{weekDays.map((day) => (
							<div
								key={day.toISOString()}
								className={calendarDayHeader}
								style={{
									textAlign: 'center',
									padding: '8px 4px',
									fontWeight: isSameDay(day, today) ? 700 : 500,
									color: isSameDay(day, today) ? '#0d6efd' : undefined,
								}}
							>
								<div
									style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}
								>
									{format(day, 'EEE', { locale })}
								</div>
								<div style={{ fontSize: '1.1rem' }}>{format(day, 'd')}</div>
							</div>
						))}
						{hours.map((hour) => (
							<div key={hour} style={{ display: 'contents' }}>
								<div
									style={{
										padding: '4px 8px',
										fontSize: '0.75rem',
										color: '#6c757d',
										textAlign: 'right',
										borderBottom: '1px solid #e9ecef',
									}}
								>
									{`${hour.toString().padStart(2, '0')}:00`}
								</div>
								{weekDays.map((day) => {
									const cellEvents = getEventsForDate(day).filter(
										(e) => e.date.getHours() === hour,
									)
									return (
										<div
											key={`${day.toISOString()}-${hour}`}
											style={{
												borderBottom: '1px solid #e9ecef',
												borderLeft: '1px solid #e9ecef',
												minHeight: 48,
												position: 'relative',
											}}
											role='button'
											tabIndex={0}
											onClick={() => onDayClick?.(day)}
										>
											{cellEvents.map((event) => (
												<div
													key={event.id}
													className={eventPill}
													style={{ backgroundColor: event.color || '#0d6efd' }}
													role='button'
													tabIndex={0}
													onClick={(e) => {
														e.stopPropagation()
														onEventClick?.(event)
													}}
												>
													{event.title}
												</div>
											))}
										</div>
									)
								})}
							</div>
						))}
					</div>
				</div>
			</div>
		)
	}

	return (
			<div className={`${calendarContainer} bg-body shadow-sm`}>
			<div className={calendarHeader}>
				<div className={calendarNav}>
					<Button variant='outline-secondary' size='sm' onClick={navigatePrev}>
						<ChevronLeft size={16} />
					</Button>
					<h5 className='mb-0 mx-2 text-nowrap'>{headerTitle()}</h5>
					<Button variant='outline-secondary' size='sm' onClick={navigateNext}>
						<ChevronRight size={16} />
					</Button>
					<Button
						variant='outline-secondary'
						size='sm'
						onClick={navigateToday}
						className='ms-1 d-none d-sm-inline-block'
					>
						Hoy
					</Button>
				</div>
			</div>

			<div className={calendarGrid}>
				<div
					className={`${calendarDayHeader} d-grid`}
					style={{ gridTemplateColumns: 'repeat(7, minmax(80px, 1fr))' }}
				>
					{['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d) => (
						<div
							key={d}
							className='text-center py-2 fw-medium text-uppercase small'
						>
							{d}
						</div>
					))}
				</div>

				{weeks.map((week, wi) => (
					<div
						key={wi}
						className='d-grid'
						style={{ gridTemplateColumns: 'repeat(7, minmax(80px, 1fr))' }}
					>
						{week.map((day) => {
							const dayEvents = getEventsForDate(day)
							const isCurrentMonth = isSameMonth(day, currentDate)
							const isTodayDate = isSameDay(day, today)

							return (
								<div
									key={day.toISOString()}
									className={getDayClasses(day, isCurrentMonth, isTodayDate)}
									role='button'
									tabIndex={0}
									onClick={(e) => handleDayClick(day, e)}
									onMouseDown={() => handleDayMouseDown(day)}
									onMouseEnter={() => handleDayMouseEnter(day)}
									onMouseUp={() => handleDayMouseUp(day)}
								>
									<div
										className={`d-flex align-items-center justify-content-center mx-auto mb-1 ${isTodayDate ? 'bg-primary text-white rounded-circle fw-semibold' : ''}`}
										style={{ width: 28, height: 28 }}
									>
										{format(day, 'd')}
									</div>
									<div className='d-flex flex-column gap-1'>
										{dayEvents.slice(0, 3).map((event) => {
											const isStart = isEventStart(event, day)
											const isEnd = isEventEnd(event, day)
											const isHovered = hoveredEvent?.id === event.id
											const pillClass = isStart
												? eventPill
												: isEnd
													? eventPillEnd
													: eventPillContinuation
											return (
												<div
													key={event.id}
													className={pillClass}
													style={{
														backgroundColor: event.color || 'var(--bs-primary)',
														opacity: isHovered ? 1 : 0.85,
														transform: isHovered ? 'scaleY(1.1)' : undefined,
														transition: 'opacity 0.15s, transform 0.15s',
													}}
													role='button'
													tabIndex={0}
													onMouseEnter={() => setHoveredEvent(event)}
													onMouseLeave={() => setHoveredEvent(null)}
													onClick={(e) => {
														e.stopPropagation()
														onEventClick?.(event)
													}}
												>
													{event.title}
												</div>
											)
										})}
										{dayEvents.length > 3 && (
											<div
												className='text-center text-muted'
												style={{ fontSize: '0.7rem' }}
											>
												+{dayEvents.length - 3} más
											</div>
										)}
									</div>
								</div>
							)
						})}
					</div>
				))}
			</div>
		</div>
	)
}
