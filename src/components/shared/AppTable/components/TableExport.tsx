import type { Column, Table } from '@tanstack/react-table'
import type { JSX } from 'react'
import { useToast } from '../../providers/ToastProvider'
import Button from '../../shared/Button'
import Icon from '../../shared/Icon'

interface ExportColumn {
	id: string
	header: string
	accessor: string
}

export const exportToExcel = async (
	data: Array<Record<string, unknown>>,
	columns: Array<ExportColumn>,
	filename: string = 'export.xlsx'
): Promise<void> => {
    try {
		const XLSX = await import('xlsx')
		const headers = columns.map((col: ExportColumn) => col.header || col.id)
		const accessors = columns.map((col: ExportColumn) => col.accessor || col.id)

		const exportData = data.map((row) => {
			const newRow: Record<string, unknown> = {}
			accessors.forEach((accessor: string, index: number) => {
				// Convertir requires_manual_review a Sí/No
				if (accessor === 'requires_manual_review') {
					const value = row[accessor]
					const isRequired = value === 1 || value === '1' || value === true || Number(value) === 1
					newRow[headers[index]] = isRequired ? 'Sí' : 'No'
				} else if (accessor === 'receive_emails_user') {
					// Convertir receive_emails_user a Sí/No
					const value = row[accessor]
					const receivesEmails = value === 1 || value === '1' || value === true || Number(value) === 1
					newRow[headers[index]] = receivesEmails ? 'Sí' : 'No'
				} else if (accessor === 'video_link_updated_at_user') {
					// Formatear fecha de actualización del video
					const value = row[accessor]
					if (value) {
						const date = new Date(value as string)
						const day = String(date.getDate()).padStart(2, '0')
						const month = String(date.getMonth() + 1).padStart(2, '0')
						const year = date.getFullYear()
						const hours = String(date.getHours()).padStart(2, '0')
						const minutes = String(date.getMinutes()).padStart(2, '0')
						newRow[headers[index]] = `${day}/${month}/${year} ${hours}:${minutes}`
					} else {
						newRow[headers[index]] = '-'
					}
				} else {
					newRow[headers[index]] = row[accessor]
				}
			})
			return newRow
		})

		const ws = XLSX.utils.json_to_sheet(exportData)
		const wb = XLSX.utils.book_new()
		XLSX.utils.book_append_sheet(wb, ws, 'Data')

		XLSX.writeFile(wb, filename)
	} catch (error) {
		console.error('Error exporting to Excel:', error)
		throw new Error(
			'No se pudo exportar a Excel. Asegúrate de tener xlsx instalado.'
		)
	}
}

export default function TableExport<T = Record<string, unknown>>({
	table
}: {
	table: Table<T>
}): JSX.Element {
	const { showToast } = useToast()

	const { isLoading, tableName } = table.options.meta as any
	const data = table.options.data as Array<Record<string, unknown>>

	const handleExport = async (): Promise<void> => {
		try {
			// Obtener TODAS las columnas (no solo visibles) excepto actions
			// Esto incluye las columnas marcadas como hiddenInTable
			const exportColumns = table
				.getAllLeafColumns()
				.filter((col) => col.id !== 'actions')

			// Preparar datos con todas las columnas para exportación
			const exportData = data.map((row: Record<string, unknown>) => {
				const newRow: Record<string, unknown> = {}
				exportColumns.forEach((col: Column<T>) => {
					const columnDef = col.columnDef as any
					// Si la columna tiene accessorFn, usarla para obtener el valor
					if (columnDef.accessorFn) {
						newRow[col.id] = columnDef.accessorFn(row as T, 0)
					}
					// Si tiene accessorKey, usarla
					else if (columnDef.accessorKey) {
						const key = columnDef.accessorKey as string
						newRow[col.id] = row[key]
					}
					// Caso por defecto: usar col.id
					else {
						newRow[col.id] = row[col.id]
					}
				})
				return newRow
			})

			// Crear headers para todas las columnas
			const headers = exportColumns.map((col: Column<T>) => {
				const header = col.columnDef.header
				return typeof header === 'string' ? header : col.id
			})

			await exportToExcel(
				exportData,
				exportColumns.map(
					(col: Column<T>, index: number): ExportColumn => ({
						id: col.id,
						header: headers[index],
						accessor: col.id
					})
				),
				`${tableName}-${new Date().toISOString().split('T')[0]}.xlsx`
			)
			showToast({
				message: `Se descargó el archivo ${tableName}.xlsx`,
				title: 'Exportación exitosa',
				variant: 'success',
				delay: 5000
			})
		} catch (error) {
			console.error('Error al exportar:', error)
			alert(
				'Error al exportar los datos. Por favor, asegúrate de tener xlsx instalado.'
			)
		}
	}

	return (
		<div>
			<Button
				disabled={isLoading}
				icon={<Icon ariaLabel='export' name='share' />}
				onClick={handleExport}
				type='button'
				variant='outline-primary'>
				Exportar
			</Button>
		</div>
	)
}
