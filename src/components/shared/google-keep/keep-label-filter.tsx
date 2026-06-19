import { Plus, Tag } from 'lucide-react'
import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'

interface KeepLabelFilterProps {
	labels: string[]
	selectedLabel: string | null
	onSelectLabel: (label: string | null) => void
	onAddLabel: (label: string) => void
}

export default function KeepLabelFilter({
	labels,
	selectedLabel,
	onSelectLabel,
	onAddLabel,
}: KeepLabelFilterProps) {
	const [isAdding, setIsAdding] = useState(false)
	const [newLabelName, setNewLabelName] = useState('')

	const handleAdd = () => {
		const label = newLabelName.trim()
		if (!label) return
		onAddLabel(label)
		setNewLabelName('')
		setIsAdding(false)
		onSelectLabel(label)
	}

	const handleCancel = () => {
		setIsAdding(false)
		setNewLabelName('')
	}

	return (
		<>
			<div className='d-flex flex-wrap gap-1 mb-3'>
				{labels.length > 0 && (
					<Button
						variant={selectedLabel === null ? 'primary' : 'outline-secondary'}
						size='sm'
						onClick={() => onSelectLabel(null)}
					>
						Todas
					</Button>
				)}
				{labels.map((label) => (
					<Button
						key={label}
						variant={selectedLabel === label ? 'primary' : 'outline-secondary'}
						size='sm'
						onClick={() => onSelectLabel(selectedLabel === label ? null : label)}
					>
						<Tag size={12} className='me-1' />
						{label}
					</Button>
				))}
				<Button
					variant='outline-secondary'
					size='sm'
					onClick={() => setIsAdding(!isAdding)}
					style={{ borderStyle: 'dashed' }}
				>
					<Plus size={12} className='me-1' />
					{labels.length > 0 ? 'Nueva' : 'Crear etiqueta'}
				</Button>
			</div>

			{isAdding && (
				<div className='d-flex align-items-center gap-2 mb-3'>
					<Form.Control
						className='form-control-sm'
						placeholder='Nombre de la etiqueta...'
						value={newLabelName}
						onChange={(e) => setNewLabelName(e.target.value)}
						onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
						autoFocus
						style={{ maxWidth: 250 }}
					/>
					<Button variant='primary' size='sm' onClick={handleAdd}>
						Agregar
					</Button>
					<Button
						variant='outline-secondary'
						size='sm'
						onClick={handleCancel}
					>
						Cancelar
					</Button>
				</div>
			)}
		</>
	)
}
