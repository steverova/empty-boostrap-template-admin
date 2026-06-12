import { Eye, EyeOff } from 'lucide-react'
import { Button, Dropdown, Form } from 'react-bootstrap'

interface ColumnVisibilityToggleProps {
	columns: { id: string; header: string; isVisible: boolean }[]
	onToggle: (columnId: string) => void
	onShowAll: () => void
	onHideAll: () => void
}

export function ColumnVisibilityToggle({
	columns,
	onToggle,
	onShowAll,
	onHideAll,
}: ColumnVisibilityToggleProps) {
	return (
		<Dropdown>
			<Dropdown.Toggle variant='secondary' size='sm' id='column-visibility-toggle'>
				<Eye size={16} />
			</Dropdown.Toggle>

			<Dropdown.Menu style={{ zIndex: 9999, minWidth: 220, maxHeight: 300, overflowY: 'auto' }}>
				<div className='px-3 py-2 d-flex justify-content-between align-items-center border-bottom'>
					<small className='text-muted fw-bold'>Columnas</small>
					<div className='d-flex gap-2'>
						<Button variant='link' size='sm' className='p-0 text-decoration-none small' onClick={onShowAll}>
							Todas
						</Button>
						<span className='text-muted'>|</span>
						<Button variant='link' size='sm' className='p-0 text-decoration-none small' onClick={onHideAll}>
							Ninguna
						</Button>
					</div>
				</div>
				<div className='py-1'>
					{columns.map((col) => (
						<div
							key={col.id}
							className='px-3 py-1 d-flex align-items-center gap-2 dropdown-item-hover'
							style={{ cursor: 'pointer' }}
							onClick={() => onToggle(col.id)}
						>
							<Form.Check
								type='checkbox'
								checked={col.isVisible}
								onChange={() => onToggle(col.id)}
								className='m-0'
								style={{ pointerEvents: 'none' }}
							/>
							{col.isVisible ? (
								<Eye size={14} className='text-muted' />
							) : (
								<EyeOff size={14} className='text-muted' />
							)}
							<span className={col.isVisible ? '' : 'text-muted'}>
								{col.header}
							</span>
						</div>
					))}
				</div>
			</Dropdown.Menu>
		</Dropdown>
	)
}
