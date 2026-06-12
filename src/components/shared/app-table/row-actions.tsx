import { Edit, Eye } from 'lucide-react'
import { Button } from 'react-bootstrap'

interface RowActionsProps {
	onEdit?: () => void
	onDetails?: () => void
}

export function RowActions({ onEdit, onDetails }: RowActionsProps) {
	return (
		<div className='d-flex gap-2'>
			{onEdit && (
				<Button
					variant='primary'
					size='sm'
					
					onClick={(e) => {
						e.stopPropagation()
						onEdit()
					}}
					title='Editar'
				>
					<Edit size={14} />
				</Button>
			)}
			{onDetails && (
				<Button
					variant='secondary'
					size='sm'
				
					onClick={(e) => {
						e.stopPropagation()
						onDetails()
					}}
					title='Detalles'
				>
					<Eye size={14} />
				</Button>
			)}
		</div>
	)
}
