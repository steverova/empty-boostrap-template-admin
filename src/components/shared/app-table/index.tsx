import {
	type ColumnDef,
	type ColumnPinningState,
	getCoreRowModel,
	getPaginationRowModel,
	type PaginationState,
	useReactTable,
} from '@tanstack/react-table'
import { ArrowLeft, ArrowRight, Copy, Check, Pin, PinOff } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Dropdown } from 'react-bootstrap'
import type { TableProps } from 'react-bootstrap/Table'
import Table from 'react-bootstrap/Table'
import { useThemeMode } from '../../../hooks/use-theme-mode'
import { PaginationTable } from './pagination-table'
import TableHeaderToolbar from './table-header-toolbar'
import { getPinnedStyle, DEFAULT_PAGE_SIZE_OPTIONS, exportToExcel } from './table-helper'

export type { ColumnDef } from '@tanstack/react-table'

declare module '@tanstack/react-table' {
	interface ColumnMeta<TData, TValue> {
		enableCopy?: boolean
	}
}

const STORAGE_KEY = 'app-table-column-pinning'

function loadPinning(): ColumnPinningState {
	try {
		const stored = localStorage.getItem(STORAGE_KEY)
		return stored ? JSON.parse(stored) : { left: [], right: [] }
	} catch {
		return { left: [], right: [] }
	}
}

function savePinning(pinning: ColumnPinningState) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(pinning))
}

export interface AppTableProps<T extends Record<string, any>>
	extends Omit<TableProps, 'onSelect'> {
	columns: ColumnDef<T, any>[]
	data: T[]
	onRefetchFn?: () => void
	onAddFn?: () => void
	pageSize?: number
	pageSizeOptions?: number[]
	fileName?: string
	sheetName?: string
}

export default function AppTable<T extends Record<string, any>>({
	columns,
	data,
	pageSize: initialPageSize = 10,
	pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
	fileName,
	sheetName,
	...props
}: AppTableProps<T>) {
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: initialPageSize,
	})

	const [columnPinning, setColumnPinning] =
		useState<ColumnPinningState>(loadPinning)

	const [copiedCellId, setCopiedCellId] = useState<string | null>(null)

	useEffect(() => {
		savePinning(columnPinning)
	}, [columnPinning])

	const table = useReactTable({
		data,
		columns,
		state: {
			pagination,
			columnPinning,
		},
		onPaginationChange: setPagination,
		onColumnPinningChange: setColumnPinning,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	})

	const totalPages = table.getPageCount()

	const handleCopy = useCallback(async (cellId: string, value: any) => {
		try {
			await navigator.clipboard.writeText(String(value ?? ''))
			setCopiedCellId(cellId)
			setTimeout(() => setCopiedCellId(null), 1500)
		} catch {
			console.error('Failed to copy')
		}
	}, [])

	const handleExport = useCallback(async () => {
		await exportToExcel({ columns, data, fileName, sheetName })
	}, [columns, data, fileName, sheetName])

	const { themeMode } = useThemeMode()
	const isDark = useMemo(() => {
		if (themeMode === 'dark') return true
		if (themeMode === 'system') {
			return window.matchMedia('(prefers-color-scheme: dark)').matches
		}
		return false
	}, [themeMode])
	const bgColor = isDark ? '#2b3035' : '#fff'
	const stripedBg = isDark ? '#343a40' : '#f8f9fa'

	return (
		<div className='border rounded-3 p-1'>
			<h1 className='fs-2'>Titulo de la tabla</h1>

			<TableHeaderToolbar onExportFn={handleExport} />

			<div style={{ maxHeight: 500, overflow: 'auto', position: 'relative' }}>
				<Table className='mb-0 table-striped table-hover' {...props}>
					<thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									const pinned = header.column.getIsPinned()

									return (
										<th
											key={header.id}
											style={{
												...getPinnedStyle({ column: header.column, isHeader: true, columnPinning, bgColor, stripedBg }),
												position: 'sticky',
												top: 0,
												backgroundColor: pinned ? bgColor : 'var(--bs-body-bg)',
											}}
										>
											<div className='d-flex align-items-center justify-content-between gap-1'>
												<span>
													{header.isPlaceholder
														? null
														: typeof header.column.columnDef.header ===
																'function'
															? header.column.columnDef.header(
																	header.getContext(),
																)
															: header.column.columnDef.header}
												</span>
												{header.column.getCanPin() && (
													<Dropdown align='end'>
														<Dropdown.Toggle
															as={Button}
															variant='link'
															size='sm'
															className='p-0 text-muted border-0'
															id={`pin-${header.column.id}`}
														>
															{pinned ? (
																<PinOff size={14} />
															) : (
																<Pin size={14} />
															)}
														</Dropdown.Toggle>

														<Dropdown.Menu style={{ zIndex: 9999 }}>
															{pinned !== 'left' && (
																<Dropdown.Item
																	onClick={() => header.column.pin('left')}
																>
																	<ArrowLeft size={14} className='me-2' />
																	Pinned left
																</Dropdown.Item>
															)}
															{pinned !== 'right' && (
																<Dropdown.Item
																	onClick={() => header.column.pin('right')}
																>
																	<ArrowRight size={14} className='me-2' />
																	Pinned right
																</Dropdown.Item>
															)}
															{pinned && (
																<Dropdown.Item
																	onClick={() => header.column.pin(false)}
																>
																	<PinOff size={14} className='me-2' />
																	Unpin
																</Dropdown.Item>
															)}
														</Dropdown.Menu>
													</Dropdown>
												)}
											</div>
										</th>
									)
								})}
							</tr>
						))}
					</thead>
					<tbody>
						{table.getRowModel().rows.map((row) => (
							<tr key={row.id}>
								{row.getVisibleCells().map((cell) => {
									const enableCopy = cell.column.columnDef.meta?.enableCopy
									const cellValue = cell.getValue()
									const isCopied = copiedCellId === cell.id

									return (
										<td
											key={cell.id}
											style={getPinnedStyle({ column: cell.column, rowIndex: row.index, columnPinning, bgColor, stripedBg })}
										>
											<div className='d-flex align-items-center justify-content-between'>
												<span className='text-truncate'>
													{typeof cell.column.columnDef.cell === 'function'
														? cell.column.columnDef.cell(cell.getContext())
														: cellValue}
												</span>
												{enableCopy && (
													<Button
														variant='link'
														size='sm'
														className='p-0 ms-2 text-muted btn-copy'
														onClick={() => handleCopy(cell.id, cellValue)}
													>
														{isCopied ? <Check size={14} className='text-success' /> : <Copy size={14} />}
													</Button>
												)}
											</div>
										</td>
									)
								})}
							</tr>
						))}
					</tbody>
				</Table>
			</div>

			{totalPages > 1 && (
				<PaginationTable
					page={pagination.pageIndex + 1}
					totalPages={totalPages}
					pageSize={pagination.pageSize}
					pageSizeOptions={pageSizeOptions}
					onPageChange={(page) =>
						setPagination((prev) => ({ ...prev, pageIndex: page - 1 }))
					}
					onPageSizeChange={(size) =>
						setPagination((prev) => ({ ...prev, pageSize: size, pageIndex: 0 }))
					}
				/>
			)}
		</div>
	)
}
