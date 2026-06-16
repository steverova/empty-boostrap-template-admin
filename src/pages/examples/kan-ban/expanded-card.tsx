import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { ArrowLeftToLine, type LucideIcon, Plus } from 'lucide-react'
import React from 'react'
import { Badge, Button, Card } from 'react-bootstrap'
import IconButton from '@/components/shared/icon-button'
import DroppableColumn from './droppable-column'
import type { Column, Task } from './kanban.types'
import SortableItem from './sortable-item'

type ExpandedCardProps = {
	icon: LucideIcon
	column: Column
	columnTasks: Task[]
	handleCollapse: (columnId: string) => void
}

export default function ExpandedCard({
	icon,
	column,
	columnTasks,
	handleCollapse,
}: ExpandedCardProps) {
	return (
		<Card className='border-0 shadow-sm d-flex flex-column flex-grow-1 mb-2' style={{ overflow: 'hidden' }}>
			<Card.Header
				className='d-flex justify-content-between align-items-center py-3 border flex-shrink-0'
				style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'var(--bs-body-bg)' }}
			>
				<div className='d-flex align-items-center gap-2'>
					<IconButton
						onClick={() => handleCollapse(column.id)}
						aria-label='Collapse column'
						style={{ color: 'var(--bs-body-color)' }}
					>
						{React.createElement(ArrowLeftToLine, { size: 18 })}
					</IconButton>
					<div style={{ color: column.color }}>
						{React.createElement(icon, { size: 24 })}
					</div>
					<Card.Title
						className='h6 mb-0 fw-semibold'
						style={{ color: column.color }}
					>
						{column.title}
					</Card.Title>
				</div>
				<Badge bg='light' text='dark' className='rounded-pill'>
					{columnTasks.length}
				</Badge>
			</Card.Header>
			<Card.Body
				className='p-3 border shadow flex-grow-1'
				style={{ overflowY: 'auto', minHeight: 0 }}
			>
				<DroppableColumn columnId={column.id}>
					<SortableContext
						items={columnTasks.map((t: Task) => t.id)}
						strategy={verticalListSortingStrategy}
					>
						{columnTasks.map((task: Task) => (
							<SortableItem key={task.id} task={task} />
						))}
					</SortableContext>
				</DroppableColumn>
				<Button variant='outline-secondary' className='w-100 mt-3' size='sm'>
					<Plus size={16} className='me-2' /> Add Task
				</Button>
			</Card.Body>
		</Card>
	)
}
