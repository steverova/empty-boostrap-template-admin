import { addDays, addHours, format, startOfWeek } from 'date-fns'
import { useState } from 'react'
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap'
import { CalendarDays, Plus, Trash2 } from 'lucide-react'
import BaseTabs from '@/components/shared/base-tabs'
import FullCalendar, {
  type CalendarEvent,
  type DateRange,
} from '@/components/shared/full-calendar'

const today = new Date()
const weekStart = startOfWeek(today, { weekStartsOn: 1 })

const COLORS = [
  { label: 'Azul', value: '#0d6efd' },
  { label: 'Verde', value: '#198754' },
  { label: 'Amarillo', value: '#ffc107' },
  { label: 'Cyan', value: '#0dcaf0' },
  { label: 'Púrpura', value: '#6f42c1' },
  { label: 'Naranja', value: '#fd7e14' },
  { label: 'Teal', value: '#20c997' },
  { label: 'Rojo', value: '#dc3545' },
]

function toDateString(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function getTimeFromDate(date: Date): string {
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

const initialEvents: CalendarEvent[] = [
  { id: '1', title: 'Reunión de equipo', date: today, color: '#0d6efd' },
  { id: '2', title: 'Sprint Review', date: addDays(today, 1), color: '#198754' },
  { id: '3', title: 'Almuerzo con cliente', date: addDays(today, 2), color: '#ffc107' },
  { id: '4', title: 'Daily Standup', date: addHours(weekStart, 9), color: '#0dcaf0' },
  { id: '5', title: 'Code Review', date: addHours(addDays(weekStart, 1), 14), color: '#6f42c1' },
  { id: '6', title: 'Planning Poker', date: addHours(addDays(weekStart, 2), 10), color: '#fd7e14' },
  { id: '7', title: '1:1 con Manager', date: addHours(addDays(weekStart, 3), 11), color: '#20c997' },
  { id: '8', title: 'Retrospectiva', date: addHours(addDays(weekStart, 4), 15), color: '#dc3545' },
  { id: '9', title: 'Capacitación', date: addDays(today, 3), endDate: addDays(today, 6), color: '#6f42c1' },
]

export function Component() {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents)
  const [selectedRange, setSelectedRange] = useState<DateRange | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)

  const [formTitle, setFormTitle] = useState('')
  const [formTime, setFormTime] = useState('09:00')
  const [formColor, setFormColor] = useState('#0d6efd')
  const [isRange, setIsRange] = useState(false)
  const [formStartDate, setFormStartDate] = useState('')
  const [formEndDate, setFormEndDate] = useState('')
  const [formEndTime, setFormEndTime] = useState('10:00')

  function openModalForCreate(date: Date) {
    setEditingEvent(null)
    setFormTitle('')
    setFormTime('09:00')
    setFormColor('#0d6efd')
    setIsRange(false)
    setFormStartDate(toDateString(date))
    setFormEndDate(toDateString(date))
    setFormEndTime('10:00')
    setShowModal(true)
  }

  function openModalForEdit(event: CalendarEvent) {
    setEditingEvent(event)
    setFormTitle(event.title)
    setFormTime(getTimeFromDate(event.date))
    setFormColor(event.color || '#0d6efd')
    setFormStartDate(toDateString(event.date))

    if (event.endDate) {
      setIsRange(true)
      setFormEndDate(toDateString(event.endDate))
      setFormEndTime(getTimeFromDate(event.endDate))
    } else {
      setIsRange(false)
      setFormEndDate(toDateString(event.date))
      setFormEndTime('10:00')
    }
    setShowModal(true)
  }

  function handleDayClick(date: Date) {
    openModalForCreate(date)
  }

  function handleEventClick(event: CalendarEvent) {
    openModalForEdit(event)
  }

  function handleRangeSelect(range: DateRange | null) {
    setSelectedRange(range)
  }

  function handleSubmit() {
    if (!formTitle.trim() || !formStartDate) return

    const [startHours, startMinutes] = formTime.split(':').map(Number)
    const eventDate = parseLocalDate(formStartDate)
    eventDate.setHours(startHours, startMinutes, 0, 0)

    if (editingEvent) {
      setEvents((prev) =>
        prev.map((e) => {
          if (e.id !== editingEvent.id) return e
          const updated: CalendarEvent = {
            ...e,
            title: formTitle.trim(),
            date: eventDate,
            color: formColor,
          }
          if (isRange && formEndDate) {
            const [endHours, endMinutes] = formEndTime.split(':').map(Number)
            const endDate = parseLocalDate(formEndDate)
            endDate.setHours(endHours, endMinutes, 0, 0)
            updated.endDate = endDate
          } else {
            updated.endDate = undefined
          }
          return updated
        }),
      )
    } else {
      const newEvent: CalendarEvent = {
        id: crypto.randomUUID(),
        title: formTitle.trim(),
        date: eventDate,
        color: formColor,
      }
      if (isRange && formEndDate) {
        const [endHours, endMinutes] = formEndTime.split(':').map(Number)
        const endDate = parseLocalDate(formEndDate)
        endDate.setHours(endHours, endMinutes, 0, 0)
        newEvent.endDate = endDate
      }
      setEvents((prev) => [...prev, newEvent])
    }
    setShowModal(false)
  }

  function handleDelete() {
    if (!editingEvent) return
    setEvents((prev) => prev.filter((e) => e.id !== editingEvent.id))
    setShowModal(false)
  }

  return (
    <Container fluid className="px-1 py-2">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h4 className="mb-0">
          <CalendarDays size={24} className="me-2" />
        </h4>
        <Button variant="primary" size="sm" onClick={() => handleDayClick(new Date())}>
          <Plus size={16} className="me-1" />
          Nuevo evento
        </Button>
      </div>

      <BaseTabs
        tabs={[
          {
            label: 'Mes',
            key: 'month',
            content: (
              <FullCalendar
                events={events}
                view="month"
                onDayClick={handleDayClick}
                onEventClick={handleEventClick}
                selectedRange={selectedRange}
                onRangeSelect={handleRangeSelect}
              />
            ),
          },
          {
            label: 'Semana',
            key: 'week',
            content: (
              <FullCalendar
                events={events}
                view="week"
                onDayClick={handleDayClick}
                onEventClick={handleEventClick}
                selectedRange={selectedRange}
                onRangeSelect={handleRangeSelect}
              />
            ),
          },
          {
            label: 'Día',
            key: 'day',
            content: (
              <FullCalendar
                events={events}
                view="day"
                onDayClick={handleDayClick}
                onEventClick={handleEventClick}
                selectedRange={selectedRange}
                onRangeSelect={handleRangeSelect}
              />
            ),
          },
        ]}
      />

      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton className="border-0">
          <Modal.Title>{editingEvent ? 'Editar evento' : 'Nuevo evento'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Reunión de equipo"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                autoFocus
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="range-switch"
                label="Evento de rango de fechas"
                checked={isRange}
                onChange={(e) => setIsRange(e.target.checked)}
              />
            </Form.Group>

            {isRange ? (
              <Row>
                <Col sm={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Fecha inicio</Form.Label>
                    <Form.Control type="date" value={formStartDate} onChange={(e) => setFormStartDate(e.target.value)} />
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Hora inicio</Form.Label>
                    <Form.Control type="time" value={formTime} onChange={(e) => setFormTime(e.target.value)} />
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Fecha fin</Form.Label>
                    <Form.Control type="date" value={formEndDate} min={formStartDate} onChange={(e) => setFormEndDate(e.target.value)} />
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Hora fin</Form.Label>
                    <Form.Control type="time" value={formEndTime} onChange={(e) => setFormEndTime(e.target.value)} />
                  </Form.Group>
                </Col>
              </Row>
            ) : (
              <Row>
                <Col sm={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Fecha</Form.Label>
                    <Form.Control type="date" value={formStartDate} onChange={(e) => setFormStartDate(e.target.value)} />
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Hora</Form.Label>
                    <Form.Control type="time" value={formTime} onChange={(e) => setFormTime(e.target.value)} />
                  </Form.Group>
                </Col>
              </Row>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Color</Form.Label>
              <div className="d-flex gap-2 flex-wrap">
                {COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setFormColor(c.value)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      backgroundColor: c.value,
                      border: formColor === c.value ? '3px solid #000' : '2px solid transparent',
                      cursor: 'pointer',
                      transition: 'border 0.15s',
                    }}
                    title={c.label}
                    aria-label={c.label}
                  />
                ))}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 d-flex justify-content-between">
          {editingEvent ? (
            <Button variant="outline-danger" size="sm" onClick={handleDelete}>
              <Trash2 size={14} className="me-1" />
              Eliminar
            </Button>
          ) : (
            <div />
          )}
          <div className="d-flex gap-2">
            <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSubmit} disabled={!formTitle.trim()}>
              {editingEvent ? 'Guardar' : (
                <>
                  <Plus size={16} className="me-1" />
                  Agregar
                </>
              )}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}
