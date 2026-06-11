import type { JSX } from 'react'

type TableColumn = {
	id: string
	header: string
}

type TableSkeletonProps = {
	tableColumns: TableColumn[]
	skeletonRows?: number
}

export default function TableSkeleton({
	tableColumns,
	skeletonRows = 15
}: TableSkeletonProps): JSX.Element {
	return (
		<>
			{Array.from({ length: skeletonRows }).map((_, index) => (
				<tr key={`skeleton-row-${index}`}>
					{tableColumns.map((col) => (
						<td
							key={`skeleton-cell-${index}-${col.id}`}
							style={{ textAlign: 'start' }}>
							<div
								style={{
									height: '20px',
									backgroundColor: '#e9ecef',
									borderRadius: '4px',
									animation: 'pulse 1.5s ease-in-out infinite'
								}}
							/>
						</td>
					))}
				</tr>
			))}
		</>
	)
}
