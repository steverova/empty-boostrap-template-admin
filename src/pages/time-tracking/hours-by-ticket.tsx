import { useMemo, useState } from 'react'
import { Card, Row, Col, Form, Button, Badge } from 'react-bootstrap'
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Cell,
	ReferenceLine,
} from 'recharts'
import { RefreshCw, Filter, ChevronDown, ChevronUp } from 'lucide-react'
import Select from 'react-select'
import { reactSelectStyles } from '@/components/shared/react-select-styles'
import { mockTimeEntries, mockCollaborators, mockClients, mockProjects, mockTasks } from '@/mocks'
import type { TimeEntry } from './time-entry.types'

const COLORS = ['#4fc3f7', '#81c784', '#ffb74d', '#e57373', '#ba68c8', '#4dd0e1', '#fff176', '#a1887f']

function getWeekRange(dateStr: string): { start: string; end: string; label: string } {
	const d = new Date(dateStr)
	const day = d.getDay()
	const diff = d.getDate() - day + (day === 0 ? -6 : 1)
	const start = new Date(d)
	start.setDate(diff)
	const end = new Date(start)
	end.setDate(start.getDate() + 6)

	const fmt = (dt: Date) => dt.toISOString().split('T')[0]
	const year = start.getFullYear()
	const oneJan = new Date(year, 0, 1)
	const weekNum = Math.ceil(((start.getTime() - oneJan.getTime()) / 86400000 + oneJan.getDay() + 1) / 7)

	return {
		start: fmt(start),
		end: fmt(end),
		label: `${year}-W${String(weekNum).padStart(2, '0')}`,
	}
}

function getAvailableWeeks(): { value: string; label: string }[] {
	const weekMap = new Map<string, string>()
	for (const entry of mockTimeEntries) {
		const week = getWeekRange(entry.day)
		if (!weekMap.has(week.start)) {
			weekMap.set(week.start, week.label)
		}
	}
	return Array.from(weekMap.entries())
		.map(([value, label]) => ({ value, label }))
		.sort((a, b) => b.value.localeCompare(a.value))
}

const priorityBg: Record<string, string> = {
	low: 'secondary',
	medium: 'warning',
	high: 'danger',
}

const statusBg: Record<string, string> = {
	backlog: 'secondary',
	todo: 'info',
	inprogress: 'primary',
	test: 'warning',
	done: 'success',
	cancelled: 'danger',
}

type HoursByTicketProps = {
	timeEntries: TimeEntry[]
}

export default function HoursByTicket({ timeEntries }: HoursByTicketProps) {
	const availableWeeks = useMemo(() => getAvailableWeeks(), [])
	const [selectedWeekStart, setSelectedWeekStart] = useState(
		availableWeeks[0]?.value ?? '',
	)
	const [selectedClient, setSelectedClient] = useState<string>('')
	const [selectedProject, setSelectedProject] = useState<string>('')
	const [selectedCollaborator, setSelectedCollaborator] = useState<string>('')
	const [filtersOpen, setFiltersOpen] = useState(true)

	const filteredProjects = useMemo(() => {
		if (!selectedClient) return mockProjects
		return mockProjects.filter((p) => p.owner === selectedClient)
	}, [selectedClient])

	const filteredEntries = useMemo(() => {
		let entries = [...timeEntries]

		if (selectedWeekStart) {
			const week = getWeekRange(selectedWeekStart)
			entries = entries.filter((e) => e.day >= week.start && e.day <= week.end)
		}

		if (selectedClient) {
			entries = entries.filter((e) => e.clientId === selectedClient)
		}

		if (selectedProject) {
			entries = entries.filter((e) => e.projectId === selectedProject)
		}

		if (selectedCollaborator) {
			entries = entries.filter((e) => e.collaboratorId === selectedCollaborator)
		}

		return entries
	}, [timeEntries, selectedWeekStart, selectedClient, selectedProject, selectedCollaborator])

	const hoursByTicket = useMemo(() => {
		const map = new Map<string, { title: string; id: string; hours: number; priority: string; status: string }>()

		for (const entry of filteredEntries) {
			if (!entry.taskId || !entry.hours) continue

			const existing = map.get(entry.taskId)
			if (existing) {
				existing.hours += entry.hours
			} else {
				const task = mockTasks.find((t) => t.id === entry.taskId)
				map.set(entry.taskId, {
					title: task?.title ?? entry.taskId,
					id: entry.taskId,
					hours: entry.hours,
					priority: task?.priority ?? 'medium',
					status: task?.status ?? 'backlog',
				})
			}
		}

		return Array.from(map.values()).sort((a, b) => b.hours - a.hours)
	}, [filteredEntries])

	const avgHours = useMemo(() => {
		if (hoursByTicket.length === 0) return 0
		const total = hoursByTicket.reduce((sum, t) => sum + t.hours, 0)
		return Math.round((total / hoursByTicket.length) * 10) / 10
	}, [hoursByTicket])

	const totalHours = useMemo(() => {
		return hoursByTicket.reduce((sum, t) => sum + t.hours, 0)
	}, [hoursByTicket])

	function handleReset() {
		setSelectedClient('')
		setSelectedProject('')
		setSelectedCollaborator('')
		setSelectedWeekStart(availableWeeks[0]?.value ?? '')
	}

	return (
		<div>
			<Card className='border-0 shadow-sm mb-4'>
				<Card.Header
					className='bg-body border-bottom py-3'
					style={{ cursor: 'pointer' }}
					onClick={() => setFiltersOpen(!filtersOpen)}
				>
					<div className='d-flex justify-content-between align-items-center'>
						<h6 className='mb-0 fw-semibold d-flex align-items-center gap-2'>
							<Filter size={18} />
							Filtros
						</h6>
						{filtersOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
					</div>
				</Card.Header>
				{filtersOpen && (
					<Card.Body>
						<Row className='g-3 align-items-end'>
							<Col md={3}>
								<Form.Label className='fw-semibold small'>Clientes</Form.Label>
							<Select
								styles={reactSelectStyles}
								options={[
									{ value: '', label: 'Seleccione un cliente' },
									...mockClients.map((c) => ({
										value: c.id,
										label: c.companyName ? `${c.name} (${c.companyName})` : c.name,
									})),
								]}
								onChange={(val: any) => setSelectedClient(val?.value ?? '')}
								value={
									selectedClient
										? mockClients
												.map((c) => ({
													value: c.id,
													label: c.companyName ? `${c.name} (${c.companyName})` : c.name,
												}))
												.find((o) => o.value === selectedClient)
										: { value: '', label: 'Seleccione un cliente' }
								}
								placeholder='Seleccione un cliente'
							/>
							</Col>
							<Col md={2}>
								<Form.Label className='fw-semibold small'>Proyecto</Form.Label>
							<Select
								styles={reactSelectStyles}
								options={[
									{ value: '', label: 'Todos' },
									...filteredProjects.map((p) => ({
										value: p.id,
										label: p.projectName,
									})),
								]}
								onChange={(val: any) => setSelectedProject(val?.value ?? '')}
								value={
									selectedProject
										? filteredProjects
												.map((p) => ({ value: p.id, label: p.projectName }))
												.find((o) => o.value === selectedProject)
										: { value: '', label: 'Todos' }
								}
								isDisabled={!selectedClient}
								placeholder='Todos'
							/>
							</Col>
							<Col md={2}>
								<Form.Label className='fw-semibold small'>Colaborador</Form.Label>
							<Select
								styles={reactSelectStyles}
								options={[
									{ value: '', label: 'Todos' },
									...mockCollaborators.map((c) => ({
										value: c.id,
										label: `${c.firstName} ${c.lastName}`,
									})),
								]}
								onChange={(val: any) => setSelectedCollaborator(val?.value ?? '')}
								value={
									selectedCollaborator
										? mockCollaborators
												.map((c) => ({ value: c.id, label: `${c.firstName} ${c.lastName}` }))
												.find((o) => o.value === selectedCollaborator)
										: { value: '', label: 'Todos' }
								}
								placeholder='Todos'
							/>
							</Col>
							<Col md={2}>
								<Form.Label className='fw-semibold small'>Semana</Form.Label>
								<Form.Select
									value={selectedWeekStart}
									onChange={(e) => setSelectedWeekStart(e.target.value)}
								>
									{availableWeeks.map((w) => (
										<option key={w.value} value={w.value}>
											{w.label}
										</option>
									))}
								</Form.Select>
							</Col>
							<Col md={3}>
								<Button
									variant='success'
									className='d-flex align-items-center gap-2'
									onClick={handleReset}
								>
									<RefreshCw size={16} />
									Actualizar
								</Button>
							</Col>
						</Row>
					</Card.Body>
				)}
			</Card>

			<Card className='border-0 shadow-sm'>
				<Card.Header className='bg-body border-bottom py-3'>
					<div className='d-flex justify-content-between align-items-center'>
						<h6 className='mb-0 fw-semibold'>Horas por Ticket</h6>
						{totalHours > 0 && (
							<span className='text-muted small'>
								Total: <strong>{totalHours}h</strong> | Tickets: <strong>{hoursByTicket.length}</strong> | Promedio: <strong>{avgHours}h</strong>
							</span>
						)}
					</div>
				</Card.Header>
				<Card.Body>
					{hoursByTicket.length === 0 ? (
						<div className='text-center text-muted py-5'>
							No hay horas registradas para los filtros seleccionados
						</div>
					) : (
						<Row>
							<Col md={8}>
								<ResponsiveContainer width='100%' height={Math.max(300, hoursByTicket.length * 60)}>
									<BarChart
										data={hoursByTicket}
										layout='vertical'
										margin={{ top: 5, right: 60, left: 20, bottom: 5 }}
									>
										<CartesianGrid strokeDasharray='3 3' stroke='#e9ecef' horizontal={false} />
										<XAxis type='number' tick={{ fontSize: 12 }} domain={[0, 'dataMax + 2']} />
										<YAxis
											type='category'
											dataKey='title'
											tick={{ fontSize: 12 }}
											width={180}
										/>
										<Tooltip
											formatter={(value) => [`${value}h`, 'Horas']}
											cursor={{ fill: 'rgba(0,0,0,0.05)' }}
										/>
										<ReferenceLine
											x={avgHours}
											stroke='#ffc107'
											strokeDasharray='5 5'
											label={{
												value: `Avg: ${avgHours}h`,
												position: 'top',
												fontSize: 11,
												fill: '#ffc107',
											}}
										/>
										<Bar dataKey='hours' radius={[0, 6, 6, 0]} barSize={30}>
											{hoursByTicket.map((_, index) => (
												<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
											))}
										</Bar>
									</BarChart>
								</ResponsiveContainer>
							</Col>
							<Col md={4}>
								<div className='border rounded p-3' style={{ maxHeight: Math.max(300, hoursByTicket.length * 60), overflowY: 'auto' }}>
									<h6 className='fw-semibold mb-3'>Detalle de Tickets</h6>
									{hoursByTicket.map((ticket, i) => (
										<div
											key={ticket.id}
											className='d-flex align-items-start justify-content-between py-2 border-bottom'
										>
											<div className='d-flex align-items-start gap-2'>
												<div
													className='rounded-circle mt-1'
													style={{
														width: 10,
														height: 10,
														backgroundColor: COLORS[i % COLORS.length],
														flexShrink: 0,
													}}
												/>
												<div>
													<div className='small fw-medium'>{ticket.title}</div>
													<div className='d-flex gap-1 mt-1'>
														<Badge bg={priorityBg[ticket.priority]} className='small'>
															{ticket.priority}
														</Badge>
														<Badge bg={statusBg[ticket.status]} className='small'>
															{ticket.status}
														</Badge>
													</div>
												</div>
											</div>
											<Badge bg='light' text='dark' className='ms-2'>
												{ticket.hours}h
											</Badge>
										</div>
									))}
								</div>
							</Col>
						</Row>
					)}
				</Card.Body>
			</Card>
		</div>
	)
}
