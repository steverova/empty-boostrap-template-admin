import {
	Briefcase,
	ChevronDown,
	ChevronUp,
	Funnel,
	Search,
	User,
	X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Accordion, Badge, Button, Form, InputGroup } from 'react-bootstrap'
import AppSelect from '@/components/shared/app-select'

export type KanbanFilters = {
	search: string
	priority: string
	assignee: string
	project: string
}

type KanbanToolbarProps = {
	filters: KanbanFilters
	assignees: string[]
	projects: string[]
	onChange: (filters: KanbanFilters) => void
}

function useMediaQuery(query: string) {
	const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

	useEffect(() => {
		const mql = window.matchMedia(query)
		const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
		mql.addEventListener('change', handler)
		return () => mql.removeEventListener('change', handler)
	}, [query])

	return matches
}

const priorityOptions = [
	{ value: '', label: 'All Priority' },
	{ value: 'high', label: 'High' },
	{ value: 'medium', label: 'Medium' },
	{ value: 'low', label: 'Low' },
]

export default function KanbanToolbar({
	filters,
	assignees,
	projects,
	onChange,
}: KanbanToolbarProps) {
	const isMobile = useMediaQuery('(max-width: 991.98px)')
	const [isOpen, setIsOpen] = useState(false)

	function update(partial: Partial<KanbanFilters>) {
		onChange({ ...filters, ...partial })
	}

	const activeCount =
		(filters.priority ? 1 : 0) +
		(filters.assignee ? 1 : 0) +
		(filters.project ? 1 : 0)

	const assigneeOptions = [
		{ value: '', label: 'All Assignees' },
		...assignees.map((a) => ({ value: a, label: a })),
	]

	const projectOptions = [
		{ value: '', label: 'All Projects' },
		...projects.map((p) => ({ value: p, label: p })),
	]

	function clearAll() {
		onChange({ search: '', priority: '', assignee: '', project: '' })
	}

	if (isMobile) {
		return (
			<div className='card mb-2'>
				<div className='d-flex align-items-center gap-2 p-2'>
					<InputGroup style={{ flex: 1 }}>
						<InputGroup.Text className='border-end-0 bg-transparent'>
							<Search size={14} />
						</InputGroup.Text>
						<Form.Control
							type='text'
							placeholder='Search tasks...'
							value={filters.search}
							onChange={(e) => update({ search: e.target.value })}
							className='border-start-0'
						/>
					</InputGroup>

					{activeCount > 0 && (
						<Badge bg='primary' pill className='d-flex align-items-center'>
							{activeCount}
							<X
								size={12}
								className='ms-1'
								style={{ cursor: 'pointer' }}
								onClick={clearAll}
							/>
						</Badge>
					)}

					<Button
						variant='link'
						className='p-0 text-decoration-none d-flex align-items-center'
						onClick={() => setIsOpen(!isOpen)}
					>
						<Funnel size={16} />
						{isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
					</Button>
				</div>

				<Accordion activeKey={isOpen ? 'filters' : ''}>
					<Accordion.Collapse eventKey='filters'>
						<div className='d-flex flex-column gap-2 p-2 pt-0'>
							<div className='d-flex align-items-center gap-2'>
								<Funnel size={14} className='text-secondary flex-shrink-0' />
								<AppSelect
									className='flex-grow-1'
									options={priorityOptions}
									value={filters.priority}
									onChange={(val) => update({ priority: val })}
									isSearchable
									placeholder='Priority...'
								/>
							</div>
							<div className='d-flex align-items-center gap-2'>
								<User size={14} className='text-secondary flex-shrink-0' />
								<AppSelect
									className='flex-grow-1'
									options={assigneeOptions}
									value={filters.assignee}
									onChange={(val) => update({ assignee: val })}
									isSearchable
									placeholder='Assignee...'
								/>
							</div>
							<div className='d-flex align-items-center gap-2'>
								<Briefcase size={14} className='text-secondary flex-shrink-0' />
								<AppSelect
									className='flex-grow-1'
									options={projectOptions}
									value={filters.project}
									onChange={(val) => update({ project: val })}
									isSearchable
									placeholder='Project...'
								/>
							</div>
						</div>
					</Accordion.Collapse>
				</Accordion>
			</div>
		)
	}

	return (
		<div className='card d-flex flex-row align-items-center gap-2 flex-wrap p-2 mb-2'>
			<InputGroup style={{ maxWidth: 260 }}>
				<InputGroup.Text className='border-end-0 bg-transparent'>
					<Search size={14} />
				</InputGroup.Text>
				<Form.Control
					type='text'
					placeholder='Search tasks...'
					value={filters.search}
					onChange={(e) => update({ search: e.target.value })}
					className='border-start-0'
				/>
			</InputGroup>

			<div style={{ width: 190 }} className='d-flex align-items-center gap-2'>
				<Funnel size={14} className='text-secondary flex-shrink-0' />
				<AppSelect
					options={priorityOptions}
					value={filters.priority}
					onChange={(val) => update({ priority: val })}
					isSearchable
					placeholder='All Priority'
				/>
			</div>

			<div style={{ width: 210 }} className='d-flex align-items-center gap-2'>
				<User size={14} className='text-secondary flex-shrink-0' />
				<AppSelect
					options={assigneeOptions}
					value={filters.assignee}
					onChange={(val) => update({ assignee: val })}
					isSearchable
					placeholder='All Assignees'
				/>
			</div>

			<div style={{ width: 210 }} className='d-flex align-items-center gap-2'>
				<Briefcase size={14} className='text-secondary flex-shrink-0' />
				<AppSelect
					options={projectOptions}
					value={filters.project}
					onChange={(val) => update({ project: val })}
					isSearchable
					placeholder='All Projects'
				/>
			</div>

			{activeCount > 0 && (
				<Badge bg='primary' pill className='d-flex align-items-center'>
					{activeCount}
					<X
						size={12}
						className='ms-1'
						style={{ cursor: 'pointer' }}
						onClick={clearAll}
					/>
				</Badge>
			)}
		</div>
	)
}
