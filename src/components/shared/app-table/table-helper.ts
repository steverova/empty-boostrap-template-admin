import type { ColumnPinningState } from '@tanstack/react-table'

export const DEFAULT_PAGE_SIZE_OPTIONS = [10, 15, 25, 50, 100]

export interface PinnedStyleOptions {
	column: any
	isHeader?: boolean
	rowIndex?: number
	columnPinning: ColumnPinningState
	bgColor: string
	stripedBg: string
}

export function getPinnedStyle({
	column,
	isHeader = false,
	rowIndex = 0,
	columnPinning,
	bgColor,
	stripedBg,
}: PinnedStyleOptions): React.CSSProperties {
	const pinned = column.getIsPinned()

	if (!pinned) return {}

	const offset =
		pinned === 'left' ? column.getStart('left') : column.getAfter('right')
	const leftIndex = columnPinning.left?.indexOf(column.id) ?? -1
	const rightIndex = columnPinning.right?.indexOf(column.id) ?? -1
	const zIndex = isHeader
		? leftIndex >= 0
			? 10 + leftIndex
			: 10 + (columnPinning.right?.length ?? 0) - rightIndex
		: leftIndex >= 0
			? 5 + leftIndex
			: 5 + (columnPinning.right?.length ?? 0) - rightIndex

	const isStriped = rowIndex % 2 === 0

	return {
		position: 'sticky',
		zIndex,
		backgroundColor: isHeader ? bgColor : isStriped ? stripedBg : bgColor,
		minWidth: 100,
		...(pinned === 'left' && { left: offset }),
		...(pinned === 'right' && { right: offset }),
		...(isHeader
			? {}
			: {
					boxShadow:
						pinned === 'left' && column.getIsLastColumn('left')
							? '2px 0 4px rgba(0,0,0,0.1)'
							: pinned === 'right' && column.getIsFirstColumn('right')
								? '-2px 0 4px rgba(0,0,0,0.1)'
								: undefined,
				}),
	}
}
