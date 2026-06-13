import { ArrowRightToLine } from 'lucide-react'
import React from 'react'
import { Badge, Card } from 'react-bootstrap'
import IconButton from '@/components/shared/icon-button'
import type { Column, Task } from './kanban.types'

type CollapseCardProps = {
	column: Column
	columnTasks: Task[]
	handleCollapse: (id: string) => void
}

export default function CollapseCard({
	handleCollapse,
	columnTasks,
	column,
}: CollapseCardProps) {
	return (
		<Card className='border-0 shadow-sm' style={{ minHeight: 120 }}>
			<Card.Body
				className='p-0 d-flex flex-column align-items-center py-3 gap-3'
				style={{ cursor: 'default' }}
			>
				<IconButton
					onClick={() => handleCollapse(column.id)}
					aria-label='Expand column'
				>
					{React.createElement(ArrowRightToLine, { size: 18 })}
				</IconButton>

				{/* Título rotado verticalmente */}
				<div
					style={{
						writingMode: 'vertical-rl',
						transform: 'rotate(180deg)',
						color: column.color,
						fontWeight: 600,
						fontSize: '0.85rem',
						userSelect: 'none',
					}}
				>
					{column.title}
				</div>

				<Badge bg='light' text='dark' className='rounded-pill'>
					{columnTasks.length}
				</Badge>
			</Card.Body>
		</Card>
	)
}
