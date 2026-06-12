import { Download } from 'lucide-react'
import { Dropdown } from 'react-bootstrap'

export interface AsyncExportDataProps {
	onExportAll?: () => void | Promise<void>
	onExportVisible?: () => void | Promise<void>
	onExportSelected?: () => void | Promise<void>
	selectedCount?: number
	disabled?: boolean
}

export function AsyncExportData({
	onExportAll,
	onExportVisible,
	onExportSelected,
	selectedCount = 0,
	disabled = false,
}: AsyncExportDataProps) {
	return (
		<Dropdown>
			<Dropdown.Toggle
				variant='secondary'
				size='sm'
				disabled={disabled}
				id='async-export-dropdown'
			>
				<Download size={14} className='me-1' />
				Export
			</Dropdown.Toggle>
			<Dropdown.Menu style={{ zIndex: 9999 }}>
				{onExportAll && (
					<Dropdown.Item onClick={onExportAll}>
						Exportar todo
					</Dropdown.Item>
				)}
				{onExportVisible && (
					<Dropdown.Item onClick={onExportVisible}>
						Exportar columnas visibles
					</Dropdown.Item>
				)}
				{onExportSelected && selectedCount > 0 && (
					<Dropdown.Item onClick={onExportSelected}>
						Exportar seleccionadas ({selectedCount})
					</Dropdown.Item>
				)}
			</Dropdown.Menu>
		</Dropdown>
	)
}
