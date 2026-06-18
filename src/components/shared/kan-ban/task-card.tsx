import {
	Check,
	Copy,
	Eye,
	GripHorizontal,
	MoreVertical,
	Pencil,
} from 'lucide-react'
import { useState } from 'react'
import { Badge, Card, Dropdown, Stack } from 'react-bootstrap'
import IconButton from '@/components/shared/icon-button'
import type { Task } from './kanban.types'
import { columns, getPriorityVariant } from './kanban-helper'

const AVATAR_COLORS = [
	'#6c757d',
	'#0d6efd',
	'#198754',
	'#ffc107',
	'#dc3545',
	'#0dcaf0',
]

function getAvatarColor(initials: string) {
	let hash = 0
	for (const ch of initials) hash = ch.charCodeAt(0) + ((hash << 5) - hash)
	return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function Avatar({ initials }: { initials: string }) {
	return (
		<div
			className='rounded-circle d-flex align-items-center justify-content-center text-white'
			style={{
				width: 24,
				height: 24,
				fontSize: 10,
				fontWeight: 600,
				backgroundColor: getAvatarColor(initials),
				marginLeft: -6,
			}}
		>
			{initials}
		</div>
	)
}

export default function TaskCard({
	task,
	isDragging = false,
	onMove,
	taskIndex,
	totalTasks,
}: {
	task: Task
	isDragging?: boolean
	onMove?: (taskId: string, targetColumnId: string) => void
	taskIndex?: number
	totalTasks?: number
}) {
	const [copied, setCopied] = useState(false)

	function handleCopyId() {
		navigator.clipboard.writeText(task.id)
		setCopied(true)
		setTimeout(() => setCopied(false), 1500)
	}
	return (
		<Card
			className='mb-1 border-2 shadow-sm bg-body-tertiary'
			style={{ opacity: isDragging ? 0.5 : 1 }}
		>
			<Card.Body className='px-3 py-1'>
				<div className='d-flex justify-content-between align-items-center mb-2'>
					<Dropdown>
						<Dropdown.Toggle
							variant='link'
							size='sm'
							caret={false}
							className='p-0 border-0 text-muted'
							style={{ textDecoration: 'none' }}
						>
							<MoreVertical size={16} />
						</Dropdown.Toggle>
						<Dropdown.Menu>
							{columns
								.filter((c) => c.id !== task.columnId)
								.map((col) => (
									<Dropdown.Item
										key={col.id}
										onClick={() => onMove?.(task.id, col.id)}
									>
										<span style={{ color: col.color }} className='me-2'>
											{col.icon && <col.icon size={14} />}
										</span>
										Move to {col.title}
									</Dropdown.Item>
								))}
						</Dropdown.Menu>
					</Dropdown>

					<div className='d-flex align-items-center gap-1'>
						{isDragging && (
							<GripHorizontal size={14} style={{ opacity: 0.5 }} />
						)}
						<IconButton
							aria-label='Edit task'
							style={{ color: 'var(--bs-body-color)' }}
						>
							<Pencil size={14} />
						</IconButton>
						<IconButton
							aria-label='View details'
							style={{ color: 'var(--bs-body-color)' }}
						>
							<Eye size={14} />
						</IconButton>
					</div>
				</div>

				{task.project && (
					<div className='d-flex justify-content-between align-items-center mb-2'>
						<small className='text-muted fw-semibold'>{task.project}</small>
						{taskIndex != null && totalTasks != null && (
							<small className='text-muted'>
								{taskIndex}/{totalTasks}
							</small>
						)}
					</div>
				)}

				<Card.Title className='h6 fw-semibold mb-2'>{task.title}</Card.Title>
				<Card.Text className='small text-muted mb-2'>
					{task.description}
				</Card.Text>

				<div className='d-flex justify-content-between align-items-center'>
					<Stack direction='horizontal' gap={2}>
						<Badge bg={getPriorityVariant(task.priority)}>
							{task.priority}
						</Badge>
						{task.assignee && (
							<small className='text-muted'>{task.assignee}</small>
						)}
					</Stack>
					{task.members && task.members.length > 0 && (
						<div className='d-flex'>
							{task.members.map((m) => (
								<Avatar key={m} initials={m} />
							))}
						</div>
					)}
				</div>

				{task.dueDate && (
					<small className='text-muted d-block mt-2'>Due: {task.dueDate}</small>
				)}

				<div
					className='d-flex align-items-center gap-1 mt-2 pt-2 border-top'
					style={{ cursor: 'pointer' }}
					onClick={handleCopyId}
				>
					<code className='text-muted small' style={{ fontSize: 11 }}>
						{task.id}
					</code>
					{copied ? (
						<Check size={12} className='text-success' />
					) : (
						<Copy size={12} className='text-muted' />
					)}
				</div>
			</Card.Body>
		</Card>
	)
}
