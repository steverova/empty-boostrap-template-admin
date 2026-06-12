interface TableSkeletonProps {
	rows?: number
	columns?: number
}

export function TableSkeleton({ rows = 5, columns = 5 }: TableSkeletonProps) {
	return (
		<tbody>
			{Array.from({ length: rows }).map((_, rowIndex) => (
				<tr key={rowIndex}>
					{Array.from({ length: columns }).map((_, colIndex) => (
						<td key={colIndex}>
							<div
								className='skeleton-pulse'
								style={{
									height: '20px',
									backgroundColor: 'var(--bs-secondary-bg)',
									borderRadius: '4px',
									width: `${Math.random() * 40 + 60}%`,
								}}
							/>
						</td>
					))}
				</tr>
			))}
		</tbody>
	)
}
