import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { ArrowLeftToLine, type LucideIcon, Plus } from 'lucide-react'
import React from 'react'
import { Badge, Card } from 'react-bootstrap'
import IconButton from '@/components/shared/icon-button'
import DroppableColumn from './droppable-column'
import type { Column, Task } from './kanban.types'
import SortableItem from './sortable-item'

type ExpandedCardProps = {
	icon: LucideIcon
	column: Column
	columnTasks: Task[]
	handleCollapse: (columnId: string) => void
	onMove?: (taskId: string, targetColumnId: string) => void
	onDetails?: (task: Task) => void
	onReply?: (task: Task) => void
}

export default function ExpandedCard({
	icon,
	column,
	columnTasks,
	handleCollapse,
	onMove,
	onDetails,
	onReply,
}: ExpandedCardProps) {
	return (
		<Card className='border-0 shadow-sm d-flex flex-column flex-grow-1' style={{ overflow: 'hidden' }}>
			<Card.Header
				className='d-flex justify-content-between align-items-center py-1 border flex-shrink-0'
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
				<div className='d-flex align-items-center gap-2'>
					<Badge bg='light' text='dark' className='rounded-pill'>
						{columnTasks.length}
					</Badge>
					<IconButton aria-label='Add task' style={{ color: column.color }}>
						<Plus size={18} />
					</IconButton>
				</div>
			</Card.Header>
			<Card.Body
				className='p-1 border shadow flex-grow-1'
				style={{ overflowY: 'auto', minHeight: 0 }}
			>
				<DroppableColumn columnId={column.id}>
					<SortableContext
						items={columnTasks.map((t: Task) => t.id)}
						strategy={verticalListSortingStrategy}
					>
						{columnTasks.map((task: Task, index: number) => (
							<SortableItem
								key={task.id}
								task={task}
								onMove={onMove}
								onDetails={onDetails}
								onReply={onReply}
								taskIndex={index + 1}
								totalTasks={columnTasks.length}
							/>
						))}
					</SortableContext>
				</DroppableColumn>
			</Card.Body>
		</Card>
	)
}
