import Skeleton, { SkeletonCard, SkeletonTable, SkeletonText } from '@/components/shared/skeleton'

export function Component() {
	return (
		<div className='container py-4'>
			<h4 className='mb-4'>Skeleton</h4>

			<div className='d-flex flex-column gap-5' style={{ maxWidth: 560 }}>
				<div>
					<h6>Variantes básicas</h6>
					<div className='d-flex align-items-center gap-3 mb-3'>
						<Skeleton variant='text' width='120px' />
						<Skeleton variant='text' width='200px' />
						<Skeleton variant='text' width='80px' />
					</div>
					<div className='d-flex align-items-center gap-3 mb-3'>
						<Skeleton variant='circle' width={48} height={48} />
						<Skeleton variant='avatar' />
						<Skeleton variant='badge' width='72px' />
					</div>
					<div className='d-flex gap-3 mb-3'>
						<Skeleton variant='rect' width='150px' height={80} />
						<Skeleton variant='image' width='200px' height={80} />
					</div>
				</div>

				<hr />

				<div>
					<h6>SkeletonText</h6>
					<SkeletonText lines={3} />
				</div>

				<hr />

				<div>
					<h6>SkeletonCard</h6>
					<div style={{ maxWidth: 320 }}>
						<SkeletonCard />
					</div>
				</div>

				<hr />

				<div>
					<h6>SkeletonTable</h6>
					<SkeletonTable rows={4} columns={5} />
				</div>

				<hr />

				<div>
					<h6>Sin animación</h6>
					<Skeleton variant='text' width='200px' animated={false} />
				</div>

				<hr />

				<div>
					<h6>Perfil de usuario (composición)</h6>
					<div className='d-flex align-items-center gap-3 p-3 border rounded'>
						<Skeleton variant='circle' width={56} height={56} />
						<div className='flex-grow-1'>
							<Skeleton variant='text' width='140px' height='1.1rem' className='mb-2' />
							<Skeleton variant='text' width='200px' height='0.85rem' />
						</div>
						<Skeleton variant='badge' width='56px' />
					</div>
				</div>
			</div>
		</div>
	)
}
