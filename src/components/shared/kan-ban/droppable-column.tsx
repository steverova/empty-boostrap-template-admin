import { useDroppable } from '@dnd-kit/core'

export default function DroppableColumn({
	columnId,
	children,
}: {
	columnId: string
	children: React.ReactNode
}) {
	const { setNodeRef, isOver } = useDroppable({ id: columnId })
	return (
		<div
			ref={setNodeRef}
			style={{
				minHeight: 80,
				borderRadius: 8,
				transition: 'background 0.15s',
				background: isOver ? 'rgba(0,0,0,0.04)' : 'transparent',
			}}
		>
			{children}
		</div>
	)
}
