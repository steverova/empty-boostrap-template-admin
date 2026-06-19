import { type CSSProperties } from 'react'

type SkeletonVariant = 'text' | 'circle' | 'rect' | 'badge' | 'avatar' | 'image'

interface SkeletonProps {
	variant?: SkeletonVariant
	width?: number | string
	height?: number | string
	className?: string
	style?: CSSProperties
	animated?: boolean
}

const VARIANTS: Record<SkeletonVariant, { defaultWidth: string; defaultHeight: string; borderRadius: string }> = {
	text: { defaultWidth: '100%', defaultHeight: '1em', borderRadius: '0.25rem' },
	circle: { defaultWidth: '40px', defaultHeight: '40px', borderRadius: '50%' },
	rect: { defaultWidth: '100%', defaultHeight: '100px', borderRadius: '0.375rem' },
	badge: { defaultWidth: '60px', defaultHeight: '24px', borderRadius: '9999px' },
	avatar: { defaultWidth: '40px', defaultHeight: '40px', borderRadius: '50%' },
	image: { defaultWidth: '100%', defaultHeight: '200px', borderRadius: '0.375rem' },
}

export default function Skeleton({
	variant = 'text',
	width,
	height,
	className,
	style,
	animated = true,
}: SkeletonProps) {
	const config = VARIANTS[variant]

	return (
		<>
			{animated && (
				<style>{`
					.skeleton-pulse {
						background: linear-gradient(
							90deg,
							var(--bs-tertiary-bg) 25%,
							var(--bs-secondary-bg) 50%,
							var(--bs-tertiary-bg) 75%
						);
						background-size: 200% 100%;
						animation: skeletonShimmer 1.5s ease-in-out infinite;
					}
					@keyframes skeletonShimmer {
						0% { background-position: 200% 0; }
						100% { background-position: -200% 0; }
					}
				`}</style>
			)}
			<div
				className={`skeleton-pulse ${className ?? ''}`}
				style={{
					width: width ?? config.defaultWidth,
					height: height ?? config.defaultHeight,
					borderRadius: config.borderRadius,
					flexShrink: 0,
					...style,
				}}
				aria-hidden='true'
			/>
		</>
	)
}

interface SkeletonTextProps {
	lines?: number
	lastWidth?: string
	className?: string
}

export function SkeletonText({ lines = 3, lastWidth = '60%', className }: SkeletonTextProps) {
	return (
		<div className={`d-flex flex-column gap-2 ${className ?? ''}`}>
			{Array.from({ length: lines }, (_, i) => (
				<Skeleton
					key={i}
					variant='text'
					width={i === lines - 1 ? lastWidth : '100%'}
				/>
			))}
		</div>
	)
}

interface SkeletonCardProps {
	className?: string
}

export function SkeletonCard({ className }: SkeletonCardProps) {
	return (
		<div className={`card ${className ?? ''}`}>
			<Skeleton variant='image' style={{ borderRadius: '0.375rem 0.375rem 0 0' }} />
			<div className='card-body d-flex flex-column gap-3'>
				<Skeleton variant='text' width='40%' height='1.25rem' />
				<SkeletonText lines={2} />
				<div className='d-flex gap-2 mt-1'>
					<Skeleton variant='badge' width='70px' />
					<Skeleton variant='badge' width='50px' />
				</div>
			</div>
		</div>
	)
}

interface SkeletonTableProps {
	rows?: number
	columns?: number
	className?: string
}

export function SkeletonTable({ rows = 5, columns = 4, className }: SkeletonTableProps) {
	return (
		<div className={`table-responsive ${className ?? ''}`}>
			<table className='table table-borderless mb-0'>
				<thead>
					<tr>
						{Array.from({ length: columns }, (_, i) => (
							<th key={i}>
								<Skeleton variant='text' width='80px' height='14px' />
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{Array.from({ length: rows }, (_, r) => (
						<tr key={r}>
							{Array.from({ length: columns }, (_, c) => (
								<td key={c}>
									<Skeleton variant='text' width={`${60 + ((r + c) * 13) % 35}%`} height='14px' />
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
