import type { ColumnDef, ColumnPinningState, VisibilityState } from '@tanstack/react-table'
import ExcelJS from 'exceljs'

export const DEFAULT_PAGE_SIZE_OPTIONS = [10, 15, 25, 50, 100]

export interface PinnedStyleOptions {
	column: any
	isHeader?: boolean
	rowIndex?: number
	columnPinning: ColumnPinningState
	bgColor: string
	stripedBg: string
}

export function getPinnedStyle({
	column,
	isHeader = false,
	rowIndex = 0,
	columnPinning,
	bgColor,
	stripedBg,
}: PinnedStyleOptions): React.CSSProperties {
	const pinned = column.getIsPinned()

	if (!pinned) return {}

	const offset =
		pinned === 'left' ? column.getStart('left') : column.getAfter('right')
	const leftIndex = columnPinning.left?.indexOf(column.id) ?? -1
	const rightIndex = columnPinning.right?.indexOf(column.id) ?? -1
	const zIndex = isHeader
		? leftIndex >= 0
			? 10 + leftIndex
			: 10 + (columnPinning.right?.length ?? 0) - rightIndex
		: leftIndex >= 0
			? 5 + leftIndex
			: 5 + (columnPinning.right?.length ?? 0) - rightIndex

	const isStriped = rowIndex % 2 === 0

	return {
		position: 'sticky',
		zIndex,
		backgroundColor: isHeader ? bgColor : isStriped ? stripedBg : bgColor,
		minWidth: 100,
		...(pinned === 'left' && { left: offset }),
		...(pinned === 'right' && { right: offset }),
		...(isHeader
			? {}
			: {
					boxShadow:
						pinned === 'left' && column.getIsLastColumn('left')
							? '2px 0 4px rgba(0,0,0,0.1)'
							: pinned === 'right' && column.getIsFirstColumn('right')
								? '-2px 0 4px rgba(0,0,0,0.1)'
								: undefined,
				}),
	}
}

// LocalStorage helpers
export function loadFromStorage<T>(key: string, fallback: T): T {
	try {
		const stored = localStorage.getItem(key)
		return stored ? JSON.parse(stored) : fallback
	} catch {
		return fallback
	}
}

export function saveToStorage<T>(key: string, value: T) {
	try {
		localStorage.setItem(key, JSON.stringify(value))
	} catch {
		console.error(`Failed to save to localStorage: ${key}`)
	}
}

export const STORAGE_KEYS = {
	COLUMN_PINNING: 'app-table-column-pinning',
	COLUMN_VISIBILITY: 'app-table-column-visibility',
	COLUMN_SIZES: 'app-table-column-sizes',
} as const

// Column resize helpers
export type ColumnSizes = Record<string, number>

export function loadColumnSizes(): ColumnSizes {
	return loadFromStorage<ColumnSizes>(STORAGE_KEYS.COLUMN_SIZES, {})
}

export function saveColumnSizes(sizes: ColumnSizes) {
	saveToStorage(STORAGE_KEYS.COLUMN_SIZES, sizes)
}

// Column visibility helpers
export function loadColumnVisibility(): VisibilityState {
	return loadFromStorage<VisibilityState>(STORAGE_KEYS.COLUMN_VISIBILITY, {})
}

export function saveColumnVisibility(visibility: VisibilityState) {
	saveToStorage(STORAGE_KEYS.COLUMN_VISIBILITY, visibility)
}

// Filter helper
export function filterData<T extends Record<string, any>>(
	data: T[],
	globalFilter: string,
	columns: ColumnDef<T, any>[],
): T[] {
	if (!globalFilter.trim()) return data

	const search = globalFilter.toLowerCase()

	return data.filter((row) =>
		columns.some((col) => {
			if ('accessorKey' in col) {
				const value = row[col.accessorKey]
				return value != null && String(value).toLowerCase().includes(search)
			}
			return false
		}),
	)
}

// Export to Excel
export interface ExportToExcelOptions<T> {
	columns: ColumnDef<T, any>[]
	data: T[]
	fileName?: string
	sheetName?: string
}

export async function exportToExcel<T extends Record<string, any>>({
	columns,
	data,
	fileName = 'export.xlsx',
	sheetName = 'Sheet1',
}: ExportToExcelOptions<T>) {
	const workbook = new ExcelJS.Workbook()
	const sheet = workbook.addWorksheet(sheetName)

	const visibleColumns = columns.filter((col) => {
		if ('accessorKey' in col) return true
		if ('accessorFn' in col) return true
		return false
	})

	const headers = visibleColumns.map((col) => {
		if (typeof col.header === 'string') return col.header
		return String('accessorKey' in col ? col.accessorKey : '')
	})

	const headerRow = sheet.addRow(headers)
	headerRow.font = { bold: true }
	headerRow.eachCell((cell) => {
		cell.fill = {
			type: 'pattern',
			pattern: 'solid',
			fgColor: { argb: 'FF4472C4' },
		}
		cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
		cell.alignment = { vertical: 'middle', horizontal: 'center' }
	})

	data.forEach((row) => {
		const values = visibleColumns.map((col) => {
			if ('accessorKey' in col) {
				const value = row[col.accessorKey]
				return value != null ? String(value) : ''
			}
			if ('accessorFn' in col) {
				const value = col.accessorFn(row, 0)
				return value != null ? String(value) : ''
			}
			return ''
		})
		sheet.addRow(values)
	})

	visibleColumns.forEach((_, index) => {
		sheet.getColumn(index + 1).width = 20
	})

	const buffer = await workbook.xlsx.writeBuffer()
	const blob = new Blob([buffer], {
		type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	})
	const url = URL.createObjectURL(blob)
	const link = document.createElement('a')
	link.href = url
	link.download = fileName
	link.click()
	URL.revokeObjectURL(url)
}
