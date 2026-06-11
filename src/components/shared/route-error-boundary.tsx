import { isRouteErrorResponse, useRouteError } from 'react-router'

export function RouteErrorBoundary() {
	const error = useRouteError()

	const getComponentInfo = () => {
		if (error instanceof Error && error.stack) {
			const match = error.stack.match(/at\s+(\w+)\s+\(/)
			return match?.[1] || 'Unknown component'
		}
		return null
	}

	const componentName = getComponentInfo()

	if (isRouteErrorResponse(error)) {
		return (
			<div className='flex h-screen flex-col items-center justify-center gap-4 px-4'>
				<h1 className='text-3xl font-bold'>
					{error.status} - {error.statusText}
				</h1>

				{componentName && (
					<p className='text-sm opacity-60'>
						Failed in component{' '}
						<code className='px-2 py-1 rounded'>{componentName}</code>
					</p>
				)}

				{error.data && (
					<pre className='text-sm opacity-80 p-3 rounded max-w-lg overflow-auto'>
						{JSON.stringify(error.data, null, 2)}
					</pre>
				)}
			</div>
		)
	}

	if (error instanceof Error) {
		return (
			<div className='flex h-screen flex-col items-center justify-center gap-4 px-4'>
				<h1 className='text-2xl font-bold'>Unexpected Error</h1>

				{componentName && (
					<p className='text-sm opacity-60'>
						Failed in component{' '}
						<code className='bg-gray-100 px-2 py-1 rounded'>
							{componentName}
						</code>
					</p>
				)}

				<p className='text-sm opacity-80'>{error.message}</p>

				{import.meta.env.DEV && (
					<pre className='text-xs opacity-70 max-w-2xl overflow-auto p-3 rounded'>
						{error.stack}
					</pre>
				)}
			</div>
		)
	}

	return (
		<div className='flex h-screen items-center justify-center'>
			<h1 className='text-xl font-bold'>Unknown Error</h1>
		</div>
	)
}