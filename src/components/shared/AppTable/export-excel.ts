/**
 * Función para exportar datos a Excel usando SheetJS
 * Esta función requiere que xlsx esté instalado
 */
export const exportToExcel = async (
	data: Array<any>,
	columns: Array<any>,
	filename: string = 'export.xlsx'
): Promise<void> => {
	try {
		// Importar dinámicamente xlsx cuando se necesite
		const XLSX = await import('xlsx')

		// Preparar los datos con solo las columnas visibles
		const headers = columns.map((col: any) => col.columnDef?.header || col.id)
		const accessors = columns.map((col: any) => col.columnDef?.accessorKey || col.id)

		const exportData = data.map((row) => {
			const newRow: Record<string, any> = {}
			accessors.forEach((accessor: string, index: number) => {
				// Convertir requires_manual_review a Sí/No
				if (accessor === 'requires_manual_review') {
					const value = row[accessor]
				
					// Convertir a número y comparar, o verificar si es true
					const isRequired = value === 1 || value === '1' || value === true || Number(value) === 1
					const converted = isRequired ? 'Sí' : 'No'
				
					newRow[headers[index]] = converted
				} else if (accessor === 'receive_emails_user') {
					// Convertir receive_emails_user a Sí/No
					const value = row[accessor]
					const receivesEmails = value === 1 || value === '1' || value === true || Number(value) === 1
					newRow[headers[index]] = receivesEmails ? 'Sí' : 'No'
				} else if (accessor === 'video_link_updated_at_user') {
					// Formatear fecha de actualización del video
					const value = row[accessor]
					if (value) {
						const date = new Date(value)
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

		// Crear workbook
		const ws = XLSX.utils.json_to_sheet(exportData)
		const wb = XLSX.utils.book_new()
		XLSX.utils.book_append_sheet(wb, ws, 'Data')

		// Configurar el ancho de las columnas
		const columnWidths: Array<{ wch: number }> = headers.map((header: string) => {
			// Hacer la columna "Detalle de Productos" más ancha
			if (header === 'Detalle de Productos') {
				return { wch: 60 } // Ancho de 60 caracteres
			}
			return { wch: 15 } // Ancho default de 15 caracteres
		})

		ws['!cols'] = columnWidths

		// Descargar archivo
		XLSX.writeFile(wb, filename)
	} catch (error) {
		console.error('Error exporting to Excel:', error)
		throw new Error('No se pudo exportar a Excel. Asegúrate de tener xlsx instalado.')
	}
}
