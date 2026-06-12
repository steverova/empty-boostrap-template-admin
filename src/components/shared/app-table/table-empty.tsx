import { Inbox } from 'lucide-react'

interface TableEmptyProps {
	message?: string
	colSpan?: number
}

export function TableEmpty({
	message = 'No se encontraron resultados',
	colSpan = 1,
}: TableEmptyProps) {
	return (
		<tbody>
			<tr>
				<td
					colSpan={colSpan}
					className='text-center py-5'
				>
					<div className='d-flex flex-column align-items-center gap-2 text-muted'>
						<Inbox size={48} strokeWidth={1.5} />
						<span>{message}</span>
					</div>
				</td>
			</tr>
		</tbody>
	)
}
