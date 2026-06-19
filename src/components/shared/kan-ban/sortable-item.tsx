import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Task } from './kanban.types'
import TaskCard from './task-card'

export default function SortableItem({
	task,
	onMove,
	onDetails,
	onReply,
	taskIndex,
	totalTasks,
}: {
	task: Task
	onMove?: (taskId: string, targetColumnId: string) => void
	onDetails?: (task: Task) => void
	onReply?: (task: Task) => void
	taskIndex?: number
	totalTasks?: number
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
	} = useSortable({ id: task.id })

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		touchAction: 'none',
	}

	return (
		<div ref={setNodeRef} style={style} {...listeners} {...attributes}>
			<TaskCard
				task={task}
				onMove={onMove}
				onDetails={onDetails}
				onReply={onReply}
				taskIndex={taskIndex}
				totalTasks={totalTasks}
			/>
		</div>
	)
}
