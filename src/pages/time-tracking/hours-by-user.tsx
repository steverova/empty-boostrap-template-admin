import { useMemo, useState } from 'react'
import { Card, Row, Col, Form, Button } from 'react-bootstrap'
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
import { mockTimeEntries, mockCollaborators, mockClients, mockProjects } from '@/mocks'
import type { TimeEntry } from './time-entry.types'

const COLORS = ['#4fc3f7', '#81c784', '#ffb74d', '#e57373', '#ba68c8', '#4dd0e1']

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

type HoursByUserProps = {
	timeEntries: TimeEntry[]
}

export default function HoursByUser({ timeEntries }: HoursByUserProps) {
	const availableWeeks = useMemo(() => getAvailableWeeks(), [])
	const [selectedWeekStart, setSelectedWeekStart] = useState(
		availableWeeks[0]?.value ?? '',
	)
	const [selectedClient, setSelectedClient] = useState<string>('')
	const [selectedProject, setSelectedProject] = useState<string>('')
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

		return entries
	}, [timeEntries, selectedWeekStart, selectedClient, selectedProject])

	const hoursByUser = useMemo(() => {
		const map = new Map<string, { name: string; hours: number }>()

		for (const collab of mockCollaborators) {
			map.set(collab.id, { name: collab.name, hours: 0 })
		}

		for (const entry of filteredEntries) {
			if (!entry.collaboratorId || !entry.hours) continue
			const collab = map.get(entry.collaboratorId)
			if (collab) {
				collab.hours += entry.hours
			}
		}

		return Array.from(map.values())
			.filter((c) => c.hours > 0)
			.sort((a, b) => b.hours - a.hours)
	}, [filteredEntries])

	const maxHours = useMemo(() => {
		return Math.max(...hoursByUser.map((c) => c.hours), 0)
	}, [hoursByUser])

	const avgHours = useMemo(() => {
		if (hoursByUser.length === 0) return 0
		const total = hoursByUser.reduce((sum, c) => sum + c.hours, 0)
		return Math.round((total / hoursByUser.length) * 10) / 10
	}, [hoursByUser])

	function handleReset() {
		setSelectedClient('')
		setSelectedProject('')
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
							<Col md={3}>
								<Form.Label className='fw-semibold small'>Proyecto</Form.Label>
							<Select
								styles={reactSelectStyles}
								options={[
									{ value: '', label: 'Seleccione un Proyecto' },
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
										: { value: '', label: 'Seleccione un Proyecto' }
								}
								isDisabled={!selectedClient}
								placeholder={selectedClient ? 'Seleccione un Proyecto' : 'Primero seleccione un cliente'}
							/>
							</Col>
							<Col md={3}>
								<Form.Label className='fw-semibold small'>Seleccionar Semana</Form.Label>
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
						<h6 className='mb-0 fw-semibold'>Horas Trabajadas por Usuario</h6>
						{avgHours > 0 && (
							<span className='text-muted small'>
								Promedio: <strong>{avgHours}h</strong> | Max: <strong>{maxHours}h</strong>
							</span>
						)}
					</div>
				</Card.Header>
				<Card.Body>
					{hoursByUser.length === 0 ? (
						<div className='text-center text-muted py-5'>
							No hay horas registradas para los filtros seleccionados
						</div>
					) : (
						<ResponsiveContainer width='100%' height={Math.max(200, hoursByUser.length * 80)}>
							<BarChart
								data={hoursByUser}
								layout='vertical'
								margin={{ top: 5, right: 50, left: 20, bottom: 5 }}
							>
								<CartesianGrid strokeDasharray='3 3' stroke='#e9ecef' horizontal={false} />
								<XAxis type='number' tick={{ fontSize: 12 }} domain={[0, 'dataMax + 2']} />
								<YAxis
									type='category'
									dataKey='name'
									tick={{ fontSize: 13, fontWeight: 500 }}
									width={120}
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
								<Bar dataKey='hours' radius={[0, 6, 6, 0]} barSize={40}>
									{hoursByUser.map((_, index) => (
										<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
									))}
								</Bar>
							</BarChart>
						</ResponsiveContainer>
					)}
				</Card.Body>
			</Card>
		</div>
	)
}
