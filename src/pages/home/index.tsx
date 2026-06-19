import {
	AlertCircle,
	Calendar,
	ClipboardCheck,
	Clock,
	FolderOpen,
	TrendingUp,
	Users,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Badge, Card, Col, Form, Row, Table } from 'react-bootstrap'
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Line,
	LineChart,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'
import {
	mockCollaborators,
	mockProjects,
	mockTasks,
	mockTimeEntries,
} from '@/mocks'

const COLORS = [
	'#0d6efd',
	'#198754',
	'#ffc107',
	'#dc3545',
	'#6f42c1',
	'#fd7e14',
]

const categoryLabels: Record<string, string> = {
	actividad_empresarial: 'Actividad Empresarial',
	enfermedad: 'Enfermedad',
	operacional: 'Operacional',
	vacaciones: 'Vacaciones',
}

const statusLabels: Record<string, string> = {
	backlog: 'Backlog',
	todo: 'Todo',
	inprogress: 'In Progress',
	test: 'Testing',
	done: 'Done',
	cancelled: 'Cancelled',
}

function getWeekRange(dateStr: string): {
	start: string
	end: string
	label: string
} {
	const d = new Date(dateStr)
	const day = d.getDay()
	const diff = d.getDate() - day + (day === 0 ? -6 : 1)
	const start = new Date(d)
	start.setDate(diff)
	const end = new Date(start)
	end.setDate(start.getDate() + 6)

	const fmt = (dt: Date) => dt.toISOString().split('T')[0]
	const fmtShort = (dt: Date) =>
		dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

	return {
		start: fmt(start),
		end: fmt(end),
		label: `${fmtShort(start)} - ${fmtShort(end)}`,
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

export function Component() {
	const availableWeeks = useMemo(() => getAvailableWeeks(), [])
	const [selectedWeekStart, setSelectedWeekStart] = useState(
		availableWeeks[0]?.value ?? '',
	)

	const selectedWeek = useMemo(() => {
		if (!selectedWeekStart) return null
		return getWeekRange(selectedWeekStart)
	}, [selectedWeekStart])

	const stats = useMemo(() => {
		const totalHours = mockTimeEntries.reduce(
			(sum, e) => sum + (e.hours ?? 0),
			0,
		)
		const operationalHours = mockTimeEntries
			.filter((e) => e.category === 'operacional')
			.reduce((sum, e) => sum + (e.hours ?? 0), 0)
		const activeProjects = mockProjects.filter(
			(p) => p.status === 'active' || p.status === 'development',
		).length
		const completedTasks = mockTasks.filter((t) => t.status === 'done').length
		const totalTasks = mockTasks.length
		const sickDays = mockTimeEntries.filter(
			(e) => e.category === 'enfermedad',
		).length
		const vacationDays = mockTimeEntries.filter(
			(e) => e.category === 'vacaciones',
		).length

		return {
			totalHours,
			operationalHours,
			activeProjects,
			completedTasks,
			totalTasks,
			sickDays,
			vacationDays,
			totalClients: new Set(
				mockTimeEntries.filter((e) => e.clientId).map((e) => e.clientId),
			).size,
		}
	}, [])

	const hoursByProject = useMemo(() => {
		const map = new Map<string, number>()
		for (const entry of mockTimeEntries) {
			if (entry.projectId && entry.hours) {
				const project = mockProjects.find((p) => p.id === entry.projectId)
				const name = project?.projectName ?? entry.projectId
				map.set(name, (map.get(name) ?? 0) + entry.hours)
			}
		}
		return Array.from(map.entries())
			.map(([name, hours]) => ({ name, hours }))
			.sort((a, b) => b.hours - a.hours)
	}, [])

	const hoursByCategory = useMemo(() => {
		const map = new Map<string, number>()
		for (const entry of mockTimeEntries) {
			map.set(
				entry.category,
				(map.get(entry.category) ?? 0) + (entry.hours ?? 0.5),
			)
		}
		return Array.from(map.entries()).map(([name, value]) => ({
			name: categoryLabels[name] ?? name,
			value,
		}))
	}, [])

	const hoursByDay = useMemo(() => {
		const map = new Map<string, number>()
		for (const entry of mockTimeEntries) {
			if (entry.hours) {
				map.set(entry.day, (map.get(entry.day) ?? 0) + entry.hours)
			}
		}
		return Array.from(map.entries())
			.map(([day, hours]) => ({ day, hours }))
			.sort((a, b) => a.day.localeCompare(b.day))
	}, [])

	const taskStatusCounts = useMemo(() => {
		const map = new Map<string, number>()
		for (const task of mockTasks) {
			map.set(task.status, (map.get(task.status) ?? 0) + 1)
		}
		return Array.from(map.entries()).map(([name, value]) => ({
			name: statusLabels[name] ?? name,
			value,
		}))
	}, [])

	const hoursByType = useMemo(() => {
		const map = new Map<string, number>()
		for (const entry of mockTimeEntries) {
			if (entry.hourType && entry.hours) {
				map.set(entry.hourType, (map.get(entry.hourType) ?? 0) + entry.hours)
			}
		}
		return Array.from(map.entries())
			.map(([name, hours]) => ({
				name: name.charAt(0).toUpperCase() + name.slice(1),
				hours,
			}))
			.sort((a, b) => b.hours - a.hours)
	}, [])

	const topTasks = useMemo(() => {
		const map = new Map<string, { title: string; hours: number }>()
		for (const entry of mockTimeEntries) {
			if (entry.taskId && entry.hours) {
				const task = mockTasks.find((t) => t.id === entry.taskId)
				const existing = map.get(entry.taskId)
				map.set(entry.taskId, {
					title: task?.title ?? entry.taskId,
					hours: (existing?.hours ?? 0) + entry.hours,
				})
			}
		}
		return Array.from(map.values())
			.sort((a, b) => b.hours - a.hours)
			.slice(0, 5)
	}, [])

	const weeklyHoursByCollaborator = useMemo(() => {
		if (!selectedWeek) return []

		const collabMap = new Map<
			string,
			{ name: string; hours: number; entries: number }
		>()

		for (const collab of mockCollaborators) {
			collabMap.set(collab.id, { name: collab.name, hours: 0, entries: 0 })
		}

		for (const entry of mockTimeEntries) {
			if (!entry.collaboratorId) continue
			if (entry.day < selectedWeek.start || entry.day > selectedWeek.end)
				continue

			const collab = collabMap.get(entry.collaboratorId)
			if (collab) {
				collab.hours += entry.hours ?? 0
				collab.entries += 1
			}
		}

		return Array.from(collabMap.values())
			.filter((c) => c.hours > 0 || c.entries > 0)
			.sort((a, b) => b.hours - a.hours)
	}, [selectedWeek])

	const weeklyHoursChart = useMemo(() => {
		return weeklyHoursByCollaborator.map((c) => ({
			name: c.name,
			hours: c.hours,
		}))
	}, [weeklyHoursByCollaborator])

	const weeklyTotalHours = useMemo(() => {
		return weeklyHoursByCollaborator.reduce((sum, c) => sum + c.hours, 0)
	}, [weeklyHoursByCollaborator])

	return (
		<div className='p-4'>
			<h4 className='fw-bold mb-4'>Dashboard</h4>

			<Row className='g-3 mb-4'>
				<Col md={3}>
					<Card className='border-0 shadow-sm h-100'>
						<Card.Body className='d-flex align-items-center gap-3'>
							<div
								className='rounded-3 d-flex align-items-center justify-content-center'
								style={{ width: 48, height: 48, backgroundColor: '#0d6efd1a' }}
							>
								<Clock size={24} className='text-primary' />
							</div>
							<div>
								<div className='text-muted small'>Total Hours</div>
								<div className='fs-4 fw-bold'>{stats.totalHours}h</div>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col md={3}>
					<Card className='border-0 shadow-sm h-100'>
						<Card.Body className='d-flex align-items-center gap-3'>
							<div
								className='rounded-3 d-flex align-items-center justify-content-center'
								style={{ width: 48, height: 48, backgroundColor: '#1987541a' }}
							>
								<FolderOpen size={24} className='text-success' />
							</div>
							<div>
								<div className='text-muted small'>Active Projects</div>
								<div className='fs-4 fw-bold'>{stats.activeProjects}</div>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col md={3}>
					<Card className='border-0 shadow-sm h-100'>
						<Card.Body className='d-flex align-items-center gap-3'>
							<div
								className='rounded-3 d-flex align-items-center justify-content-center'
								style={{ width: 48, height: 48, backgroundColor: '#6f42c11a' }}
							>
								<ClipboardCheck
									size={24}
									className='text-purple'
									style={{ color: '#6f42c1' }}
								/>
							</div>
							<div>
								<div className='text-muted small'>Tasks Done</div>
								<div className='fs-4 fw-bold'>
									{stats.completedTasks}/{stats.totalTasks}
								</div>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col md={3}>
					<Card className='border-0 shadow-sm h-100'>
						<Card.Body className='d-flex align-items-center gap-3'>
							<div
								className='rounded-3 d-flex align-items-center justify-content-center'
								style={{ width: 48, height: 48, backgroundColor: '#ffc1071a' }}
							>
								<Users size={24} className='text-warning' />
							</div>
							<div>
								<div className='text-muted small'>Clients</div>
								<div className='fs-4 fw-bold'>{stats.totalClients}</div>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Card className='border-0 shadow-sm mb-4'>
				<Card.Header className='bg-body border-bottom py-3 d-flex justify-content-between align-items-center'>
					<h6 className='mb-0 fw-semibold d-flex align-items-center gap-2'>
						<Calendar size={18} />
						Weekly Hours by Collaborator
					</h6>
					<div className='d-flex align-items-center gap-3'>
						{selectedWeek && (
							<Badge bg='primary' className='fs-6'>
								{weeklyTotalHours}h total
							</Badge>
						)}
						<Form.Select
							style={{ width: 220 }}
							value={selectedWeekStart}
							onChange={(e) => setSelectedWeekStart(e.target.value)}
						>
							{availableWeeks.map((w) => (
								<option key={w.value} value={w.value}>
									{w.label}
								</option>
							))}
						</Form.Select>
					</div>
				</Card.Header>
				<Card.Body>
					{weeklyHoursByCollaborator.length === 0 ? (
						<div className='text-center text-muted py-4'>
							No hours reported for this week
						</div>
					) : (
						<Row>
							<Col md={7}>
								<ResponsiveContainer width='100%' height={300}>
									<BarChart data={weeklyHoursChart}>
										<CartesianGrid strokeDasharray='3 3' stroke='#e9ecef' />
										<XAxis dataKey='name' tick={{ fontSize: 12 }} />
										<YAxis tick={{ fontSize: 12 }} />
										<Tooltip />
										<Bar dataKey='hours' radius={[4, 4, 0, 0]}>
											{weeklyHoursChart.map((_, index) => (
												<Cell
													key={`cell-${index}`}
													fill={COLORS[index % COLORS.length]}
												/>
											))}
										</Bar>
									</BarChart>
								</ResponsiveContainer>
							</Col>
							<Col md={5}>
								<Table hover className='mb-0'>
									<thead>
										<tr>
											<th>Collaborator</th>
											<th className='text-end'>Entries</th>
											<th className='text-end'>Hours</th>
										</tr>
									</thead>
									<tbody>
										{weeklyHoursByCollaborator.map((c, i) => (
											<tr key={i}>
												<td>
													<div className='d-flex align-items-center gap-2'>
														<div
															className='rounded-circle'
															style={{
																width: 10,
																height: 10,
																backgroundColor: COLORS[i % COLORS.length],
															}}
														/>
														{c.name}
													</div>
												</td>
												<td className='text-end'>{c.entries}</td>
												<td className='text-end fw-semibold'>{c.hours}h</td>
											</tr>
										))}
									</tbody>
									<tfoot>
										<tr className='border-top'>
											<td className='fw-bold'>Total</td>
											<td className='text-end fw-bold'>
												{weeklyHoursByCollaborator.reduce(
													(s, c) => s + c.entries,
													0,
												)}
											</td>
											<td className='text-end fw-bold'>{weeklyTotalHours}h</td>
										</tr>
									</tfoot>
								</Table>
							</Col>
						</Row>
					)}
				</Card.Body>
			</Card>

			<Row className='g-3 mb-4'>
				<Col md={8}>
					<Card className='border-0 shadow-sm h-100'>
						<Card.Header className='bg-body border-bottom py-3'>
							<h6 className='mb-0 fw-semibold'>Hours by Project</h6>
						</Card.Header>
						<Card.Body>
							<ResponsiveContainer width='100%' height={300}>
								<BarChart data={hoursByProject}>
									<CartesianGrid strokeDasharray='3 3' stroke='#e9ecef' />
									<XAxis dataKey='name' tick={{ fontSize: 12 }} />
									<YAxis tick={{ fontSize: 12 }} />
									<Tooltip />
									<Bar dataKey='hours' fill='#0d6efd' radius={[4, 4, 0, 0]} />
								</BarChart>
							</ResponsiveContainer>
						</Card.Body>
					</Card>
				</Col>
				<Col md={4}>
					<Card className='border-0 shadow-sm h-100'>
						<Card.Header className='bg-body border-bottom py-3'>
							<h6 className='mb-0 fw-semibold'>Hours by Category</h6>
						</Card.Header>
						<Card.Body>
							<ResponsiveContainer width='100%' height={300}>
								<PieChart>
									<Pie
										data={hoursByCategory}
										cx='50%'
										cy='50%'
										innerRadius={60}
										outerRadius={100}
										paddingAngle={3}
										dataKey='value'
									>
										{hoursByCategory.map((_, index) => (
											<Cell
												key={`cell-${index}`}
												fill={COLORS[index % COLORS.length]}
											/>
										))}
									</Pie>
									<Tooltip />
									<Legend />
								</PieChart>
							</ResponsiveContainer>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row className='g-3 mb-4'>
				<Col md={6}>
					<Card className='border-0 shadow-sm h-100'>
						<Card.Header className='bg-body border-bottom py-3'>
							<h6 className='mb-0 fw-semibold'>Hours Over Time</h6>
						</Card.Header>
						<Card.Body>
							<ResponsiveContainer width='100%' height={280}>
								<LineChart data={hoursByDay}>
									<CartesianGrid strokeDasharray='3 3' stroke='#e9ecef' />
									<XAxis dataKey='day' tick={{ fontSize: 11 }} />
									<YAxis tick={{ fontSize: 12 }} />
									<Tooltip />
									<Line
										type='monotone'
										dataKey='hours'
										stroke='#0d6efd'
										strokeWidth={2}
										dot={{ r: 4 }}
									/>
								</LineChart>
							</ResponsiveContainer>
						</Card.Body>
					</Card>
				</Col>
				<Col md={6}>
					<Card className='border-0 shadow-sm h-100'>
						<Card.Header className='bg-body border-bottom py-3'>
							<h6 className='mb-0 fw-semibold'>Hours by Type</h6>
						</Card.Header>
						<Card.Body>
							<ResponsiveContainer width='100%' height={280}>
								<BarChart data={hoursByType} layout='vertical'>
									<CartesianGrid strokeDasharray='3 3' stroke='#e9ecef' />
									<XAxis type='number' tick={{ fontSize: 12 }} />
									<YAxis
										type='category'
										dataKey='name'
										tick={{ fontSize: 12 }}
										width={100}
									/>
									<Tooltip />
									<Bar dataKey='hours' radius={[0, 4, 4, 0]}>
										{hoursByType.map((_, index) => (
											<Cell
												key={`cell-${index}`}
												fill={COLORS[index % COLORS.length]}
											/>
										))}
									</Bar>
								</BarChart>
							</ResponsiveContainer>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row className='g-3'>
				<Col md={4}>
					<Card className='border-0 shadow-sm h-100'>
						<Card.Header className='bg-body border-bottom py-3'>
							<h6 className='mb-0 fw-semibold'>Task Status</h6>
						</Card.Header>
						<Card.Body>
							<ResponsiveContainer width='100%' height={260}>
								<PieChart>
									<Pie
										data={taskStatusCounts}
										cx='50%'
										cy='50%'
										outerRadius={90}
										dataKey='value'
										label={({ name, percent }) =>
											`${name} ${((percent ?? 0) * 100).toFixed(0)}%`
										}
									>
										{taskStatusCounts.map((_, index) => (
											<Cell
												key={`cell-${index}`}
												fill={COLORS[index % COLORS.length]}
											/>
										))}
									</Pie>
									<Tooltip />
								</PieChart>
							</ResponsiveContainer>
						</Card.Body>
					</Card>
				</Col>
				<Col md={4}>
					<Card className='border-0 shadow-sm h-100'>
						<Card.Header className='bg-body border-bottom py-3'>
							<h6 className='mb-0 fw-semibold'>Top Tasks by Hours</h6>
						</Card.Header>
						<Card.Body className='p-0'>
							{topTasks.map((task, i) => (
								<div
									key={i}
									className='d-flex align-items-center justify-content-between px-3 py-2 border-bottom'
								>
									<div className='d-flex align-items-center gap-2'>
										<div
											className='rounded-circle'
											style={{
												width: 8,
												height: 8,
												backgroundColor: COLORS[i % COLORS.length],
											}}
										/>
										<span className='small'>{task.title}</span>
									</div>
									<Badge bg='light' text='dark'>
										{task.hours}h
									</Badge>
								</div>
							))}
						</Card.Body>
					</Card>
				</Col>
				<Col md={4}>
					<Card className='border-0 shadow-sm h-100'>
						<Card.Header className='bg-body border-bottom py-3'>
							<h6 className='mb-0 fw-semibold'>Quick Stats</h6>
						</Card.Header>
						<Card.Body>
							<div className='d-flex flex-column gap-3'>
								<div className='d-flex justify-content-between align-items-center'>
									<div className='d-flex align-items-center gap-2'>
										<TrendingUp size={16} className='text-success' />
										<span className='small'>Operational Hours</span>
									</div>
									<span className='fw-semibold'>{stats.operationalHours}h</span>
								</div>
								<hr className='my-0' />
								<div className='d-flex justify-content-between align-items-center'>
									<div className='d-flex align-items-center gap-2'>
										<AlertCircle size={16} className='text-warning' />
										<span className='small'>Sick Days</span>
									</div>
									<Badge bg='warning' text='dark'>
										{stats.sickDays}
									</Badge>
								</div>
								<hr className='my-0' />
								<div className='d-flex justify-content-between align-items-center'>
									<div className='d-flex align-items-center gap-2'>
										<Users size={16} className='text-info' />
										<span className='small'>Vacation Days</span>
									</div>
									<Badge bg='info'>{stats.vacationDays}</Badge>
								</div>
								<hr className='my-0' />
								<div className='d-flex justify-content-between align-items-center'>
									<div className='d-flex align-items-center gap-2'>
										<FolderOpen size={16} className='text-primary' />
										<span className='small'>Completed Projects</span>
									</div>
									<span className='fw-semibold'>
										{
											mockProjects.filter((p) => p.status === 'completed')
												.length
										}
										/{mockProjects.length}
									</span>
								</div>
								<hr className='my-0' />
								<div className='d-flex justify-content-between align-items-center'>
									<div className='d-flex align-items-center gap-2'>
										<ClipboardCheck
											size={16}
											className='text-purple'
											style={{ color: '#6f42c1' }}
										/>
										<span className='small'>Team Members</span>
									</div>
									<span className='fw-semibold'>
										{mockCollaborators.length}
									</span>
								</div>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</div>
	)
}
