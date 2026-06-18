import { Funnel, Search, X, User, Briefcase } from 'lucide-react'
import { Badge, Form, InputGroup } from 'react-bootstrap'

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

export default function KanbanToolbar({
	filters,
	assignees,
	projects,
	onChange,
}: KanbanToolbarProps) {
	function update(partial: Partial<KanbanFilters>) {
		onChange({ ...filters, ...partial })
	}

	const activeCount =
		(filters.priority ? 1 : 0) +
		(filters.assignee ? 1 : 0) +
		(filters.project ? 1 : 0)

	return (
		<div className='card d-flex flex-row align-items-center gap-2 flex-wrap p-2'>
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

			<InputGroup style={{ width: 170 }}>
				<InputGroup.Text className='bg-transparent'>
					<Funnel size={16} />
				</InputGroup.Text>
				<Form.Select
					style={{ fontSize: 14, padding: '6px 10px' }}
					value={filters.priority}
					onChange={(e) => update({ priority: e.target.value })}
				>
					<option value=''>All Priority</option>
					<option value='high'>High</option>
					<option value='medium'>Medium</option>
					<option value='low'>Low</option>
				</Form.Select>
			</InputGroup>

			<InputGroup style={{ width: 190 }}>
				<InputGroup.Text className='bg-transparent'>
					<User size={16} />
				</InputGroup.Text>
				<Form.Select
					style={{ fontSize: 14, padding: '6px 10px' }}
					value={filters.assignee}
					onChange={(e) => update({ assignee: e.target.value })}
				>
					<option value=''>All Assignees</option>
					{assignees.map((a) => (
						<option key={a} value={a}>
							{a}
						</option>
					))}
				</Form.Select>
			</InputGroup>

			<InputGroup style={{ width: 190 }}>
				<InputGroup.Text className='bg-transparent'>
					<Briefcase size={16} />
				</InputGroup.Text>
				<Form.Select
					style={{ fontSize: 14, padding: '6px 10px' }}
					value={filters.project}
					onChange={(e) => update({ project: e.target.value })}
				>
					<option value=''>All Projects</option>
					{projects.map((p) => (
						<option key={p} value={p}>
							{p}
						</option>
					))}
				</Form.Select>
			</InputGroup>

			{activeCount > 0 && (
				<Badge bg='primary' pill className='d-flex align-items-center'>
					{activeCount}
					<X
						size={12}
						className='ms-1'
						style={{ cursor: 'pointer' }}
						onClick={() =>
							onChange({ search: '', priority: '', assignee: '', project: '' })
						}
					/>
				</Badge>
			)}
		</div>
	)
}
