export default function LoadingFallback() {
	const dots = [
		{ cx: 12.5, cy: 12.5, delay: '0ms' },
		{ cx: 12.5, cy: 52.5, delay: '100ms' },
		{ cx: 52.5, cy: 12.5, delay: '300ms' },
		{ cx: 52.5, cy: 52.5, delay: '600ms' },
		{ cx: 92.5, cy: 12.5, delay: '800ms' },
		{ cx: 92.5, cy: 52.5, delay: '400ms' },
		{ cx: 12.5, cy: 92.5, delay: '700ms' },
		{ cx: 52.5, cy: 92.5, delay: '500ms' },
		{ cx: 92.5, cy: 92.5, delay: '200ms' },
	]

	return (
		<div
			className='d-flex align-items-center justify-content-center w-100'
			style={{
				minHeight: '100dvh',
				paddingBottom: '15vh', // lo empuja más hacia arriba
			}}
		>
			<style>
				{`
          .loading-dot {
            opacity: 1;
            animation: pulseDot 1s linear infinite;
          }

          @keyframes pulseDot {
            0%, 100% { opacity: 1; }
            50% { opacity: .2; }
          }
        `}
			</style>

            <svg
                width='64'
                height='64'
                viewBox='0 0 105 105'
                fill='currentColor'
                className='text-success'
            >
                <title>{'Loading...'}</title>

				{dots.map((dot) => (
					<circle
						key={`${dot.cx}-${dot.cy}`}
						cx={dot.cx}
						cy={dot.cy}
						r='12.5'
						className='loading-dot'
						style={{ animationDelay: dot.delay }}
					/>
				))}
			</svg>
		</div>
	)
}
