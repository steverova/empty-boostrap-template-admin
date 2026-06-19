import { LayoutGrid, List } from 'lucide-react'
import { Button, Form } from 'react-bootstrap'
import type { ViewMode } from './types'

interface KeepHeaderProps {
	search: string
	onSearchChange: (value: string) => void
	viewMode: ViewMode
 onViewModeChange: (mode: ViewMode) => void
}

export default function KeepHeader({
	search,
	onSearchChange,
	viewMode,
	onViewModeChange,
}: KeepHeaderProps) {
	return (
		<div className='d-flex align-items-center gap-3 px-3 py-2 border-bottom bg-body flex-shrink-0'>
			<Form.Control
				className='rounded-pill'
				placeholder='Buscar notas...'
				value={search}
				onChange={(e) => onSearchChange(e.target.value)}
				style={{ maxWidth: 500 }}
			/>
			<div className='d-flex align-items-center gap-1'>
				<Button
					variant={viewMode === 'grid' ? 'primary' : 'outline-secondary'}
					size='sm'
					onClick={() => onViewModeChange('grid')}
					title='Vista cuadrícula'
				>
					<LayoutGrid size={16} />
				</Button>
				<Button
					variant={viewMode === 'list' ? 'primary' : 'outline-secondary'}
					size='sm'
					onClick={() => onViewModeChange('list')}
					title='Vista lista'
				>
					<List size={16} />
				</Button>
			</div>
		</div>
	)
}
