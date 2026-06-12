import { Edit, Eye, Pin } from 'lucide-react'
import { Button } from 'react-bootstrap'

interface RowActionsProps {
	onEdit?: () => void
	onDetails?: () => void
	onPin?: () => void
}

export function RowActions({ onEdit, onDetails, onPin }: RowActionsProps) {
	return (
		<div className='d-flex gap-2 py-0'>
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
			{onPin && (
				<Button
					variant='outline-warning'
					size='sm'
					onClick={(e) => {
						e.stopPropagation()
						onPin()
					}}
					title='Fijar'
				>
					<Pin size={14} />
				</Button>
			)}
		</div>
	)
}
