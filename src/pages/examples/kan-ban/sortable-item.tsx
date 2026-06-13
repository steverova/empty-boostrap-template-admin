import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Task } from './kanban.types'
import TaskCard from './task-card'

export default function SortableItem({ task }: { task: Task }) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: task.id })

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	}

	return (
		<div ref={setNodeRef} style={style} {...listeners} {...attributes}>
			<TaskCard task={task} isDragging={isDragging} />
		</div>
	)
}
