import { addDays, format, subDays } from 'date-fns'
import { es } from 'date-fns/locale'
import { useState } from 'react'
import Calendar from '@/components/shared/calendar'
import DatePicker from '@/components/shared/date-picker'

export default function DatePickerExamplePage() {
	const [selectedDate, setSelectedDate] = useState<Date | null>(null)
	const [weekDates, setWeekDates] = useState<Date[]>([])
	const [rangeStart, setRangeStart] = useState<Date | null>(null)
	const [rangeEnd, setRangeEnd] = useState<Date | null>(null)
	const [multipleDates, setMultipleDates] = useState<Date[]>([])

	const minDate = subDays(new Date(), 7)
	const maxDate = addDays(new Date(), 30)

	return (
		<div className='container py-4'>
			<h4>Calendario</h4>

			<div className='d-flex gap-4 flex-wrap'>
				<div>
					<h6>Normal</h6>
					<Calendar
						showWeeks
						onSelectWeek={setWeekDates}
						value={selectedDate}
						onChange={setSelectedDate}
						locale={es}
						minDate={minDate}
						maxDate={maxDate}
						weekStartsOn={1}
						showOutsideDays
						showToday
						showClear
						keyboardNav
						placeholder='Selecciona una fecha'
					/>
					{selectedDate && (
						<p className='mt-2 text-muted small'>
							Seleccionado:{' '}
							<strong>
								{format(selectedDate, 'EEEE d MMMM yyyy', { locale: es })}
							</strong>
						</p>
					)}
					{weekDates.length > 0 && (
						<p className='mt-1 text-muted small'>
							Semana:{' '}
							<strong>
								{format(weekDates[0], 'd MMM', { locale: es })} –{' '}
								{format(weekDates[6], 'd MMM yyyy', { locale: es })}
							</strong>
						</p>
					)}
				</div>

				<div>
					<h6>Rango</h6>
					<Calendar
						mode='range'
						rangeStart={rangeStart}
						rangeEnd={rangeEnd}
						onRangeChange={(s, e) => {
							setRangeStart(s)
							setRangeEnd(e)
						}}
						locale={es}
						weekStartsOn={1}
						showToday
						showClear
					/>
					{rangeStart && rangeEnd && (
						<p className='mt-2 text-muted small'>
							<strong>
								{format(rangeStart, 'd MMM')} – {format(rangeEnd, 'd MMM yyyy')}
							</strong>
						</p>
					)}
				</div>

				<div>
					<h6>Múltiples</h6>
					<Calendar
						mode='multiple'
						selectedDates={multipleDates}
						onMultipleChange={setMultipleDates}
						locale={es}
						weekStartsOn={1}
						showClear
					/>
					{multipleDates.length > 0 && (
						<p className='mt-2 text-muted small'>
							<strong>{multipleDates.length} fechas seleccionadas</strong>
						</p>
					)}
        </div>

        <hr />

        <div className='w-100'>
          <h2>Date Picker</h2>
  
          <DatePicker mode='range'  align="end"/>
        </div>
			</div>
		</div>
	)
}
