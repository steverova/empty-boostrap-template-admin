import { addDays, format, subDays } from 'date-fns'
import { enUS, es } from 'date-fns/locale'
import { useState } from 'react'
import Calendar from '@/components/shared/calendar'

export default function DatePickerExamplePage() {
	const [selectedDate, setSelectedDate] = useState<Date | null>(null)
	const [weekDates, setWeekDates] = useState<Date[]>([])

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
			</div>
		</div>
	)
}
