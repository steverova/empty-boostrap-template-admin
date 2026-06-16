import { useDebouncedCallback } from '@hooks/use-debounce'
import { useThemeMode } from '@hooks/use-theme-mode'
import {
	type ColumnDef,
	type ColumnPinningState,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type PaginationState,
	type SortingState,
	useReactTable,
	type VisibilityState,
} from '@tanstack/react-table'
import {
	ArrowDown,
	ArrowLeft,
	ArrowRight,
	ArrowUp,
	ArrowUpDown,
	Check,
	Copy,
	Maximize2,
	Pin,
	PinOff,
	Plus,
	RotateCcw,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Dropdown } from 'react-bootstrap'
import type { TableProps } from 'react-bootstrap/Table'
import Table from 'react-bootstrap/Table'
import { ColumnVisibilityToggle } from './column-visibility-toggle'
import { PaginationTable } from './pagination-table'
import { SearchFilter } from './search-filter'
import { TableEmpty } from './table-empty'
import {
	type ColumnSizes,
	DEFAULT_PAGE_SIZE_OPTIONS,
	exportToExcel,
	filterData,
	getPinnedStyle,
	loadFromStorage,
	STORAGE_KEYS,
	saveToStorage,
} from './table-helper'
import { TableSkeleton } from './table-skeleton'

export type { ColumnDef } from '@tanstack/react-table'
export type { AsyncExportDataProps } from './async-export-data'
export { AsyncExportData } from './async-export-data'

declare module '@tanstack/react-table' {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface ColumnMeta<TData, TValue> {
		enableCopy?: boolean
	}
}

export interface AppTableProps<T extends Record<string, any>>
	extends Omit<TableProps, 'onSelect'> {
	columns: ColumnDef<T, any>[]
	data: T[]
	isLoading?: boolean
	onRefetchFn?: () => void
	onAddFn?: () => void
	onRowClick?: (row: T) => void
	rowActions?: (row: T) => React.ReactNode
	pageSize?: number
	pageSizeOptions?: number[]
	fileName?: string
	sheetName?: string
	enableSearch?: boolean
	enableColumnVisibility?: boolean
	enableRowSelection?: boolean
	enableColumnResize?: boolean
	enableExport?: boolean
	enableAsync?: boolean
	totalCount?: number
	searchDebounceMs?: number
	onSearchChange?: (value: string) => void
	onPaginationChange?: (page: number, pageSize: number) => void
	onSortingChange?: (sorting: SortingState) => void
}

export default function AppTable<T extends Record<string, any>>({
	columns,
	data,
	isLoading = false,
	pageSize: initialPageSize = 10,
	pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
	fileName,
	sheetName,
	enableSearch = true,
	enableColumnVisibility = true,
	enableRowSelection = false,
	enableColumnResize = false,
	enableExport = true,
	enableAsync = false,
	totalCount,
	searchDebounceMs = 300,
	onSearchChange,
	onPaginationChange,
	onSortingChange,
	onRefetchFn,
	onAddFn,
	onRowClick,
	rowActions,
	...props
}: AppTableProps<T>) {
	const [globalFilter, setGlobalFilter] = useState('')
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: initialPageSize,
	})
	const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(() =>
		loadFromStorage<ColumnPinningState>(STORAGE_KEYS.COLUMN_PINNING, {
			left: [],
			right: [],
		}),
	)
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		() => loadFromStorage<VisibilityState>(STORAGE_KEYS.COLUMN_VISIBILITY, {}),
	)
	const [rowSelection, setRowSelection] = useState({})
	const [columnSizing, setColumnSizing] = useState<ColumnSizes>(() =>
		loadFromStorage<ColumnSizes>(STORAGE_KEYS.COLUMN_SIZES, {}),
	)
	const [copiedCellId, setCopiedCellId] = useState<string | null>(null)

	useEffect(() => {
		saveToStorage(STORAGE_KEYS.COLUMN_PINNING, columnPinning)
	}, [columnPinning])

	useEffect(() => {
		saveToStorage(STORAGE_KEYS.COLUMN_VISIBILITY, columnVisibility)
	}, [columnVisibility])

	useEffect(() => {
		saveToStorage(STORAGE_KEYS.COLUMN_SIZES, columnSizing)
	}, [columnSizing])

	const filteredData = useMemo(() => {
		if (enableAsync) return data
		return filterData(data, globalFilter, columns)
	}, [data, globalFilter, columns, enableAsync])

	const tableColumns = useMemo(() => {
		const allColumns: ColumnDef<T, any>[] = [...columns]
		if (rowActions) {
			allColumns.push({
				id: 'actions',
				header: 'Actions',
				enableSorting: false,
				enableHiding: false,
				cell: ({ row }) => <div className=''>{rowActions(row.original)}</div>,
			})
		}
		return allColumns
	}, [columns, rowActions])

	const handleAsyncPaginationChange = useCallback(
		(
			updater: PaginationState | ((old: PaginationState) => PaginationState),
		) => {
			setPagination((prev) => {
				const next = typeof updater === 'function' ? updater(prev) : updater
				onPaginationChange?.(next.pageIndex + 1, next.pageSize)
				return next
			})
		},
		[onPaginationChange],
	)

	const handleAsyncSortingChange = useCallback(
		(updater: SortingState | ((old: SortingState) => SortingState)) => {
			setSorting((prev) => {
				const next = typeof updater === 'function' ? updater(prev) : updater
				onSortingChange?.(next)
				return next
			})
		},
		[onSortingChange],
	)

	const table = useReactTable({
		data: filteredData,
		columns: tableColumns,
		state: {
			pagination,
			columnPinning,
			sorting,
			columnVisibility,
			rowSelection,
			columnSizing,
		},
		onPaginationChange: enableAsync
			? handleAsyncPaginationChange
			: setPagination,
		onColumnPinningChange: setColumnPinning,
		onSortingChange: enableAsync ? handleAsyncSortingChange : setSorting,
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		onColumnSizingChange: setColumnSizing,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: enableAsync ? undefined : getPaginationRowModel(),
		getSortedRowModel: enableAsync ? undefined : getSortedRowModel(),
		columnResizeMode: enableColumnResize ? 'onChange' : undefined,
		enableRowSelection,
		pageCount: enableAsync
			? Math.ceil((totalCount ?? 0) / pagination.pageSize)
			: undefined,
	})

	const totalPages = enableAsync
		? Math.ceil((totalCount ?? 0) / pagination.pageSize)
		: table.getPageCount()

	const handleCopy = useCallback(async (cellId: string, value: any) => {
		try {
			await navigator.clipboard.writeText(String(value ?? ''))
			setCopiedCellId(cellId)
			setTimeout(() => setCopiedCellId(null), 1500)
		} catch {
			console.error('Failed to copy')
		}
	}, [])

	const handleExportAll = useCallback(async () => {
		await exportToExcel({ columns, data: filteredData, fileName, sheetName })
	}, [columns, filteredData, fileName, sheetName])

	const handleExportVisible = useCallback(async () => {
		const visibleColumns = columns.filter((col) => {
			if ('accessorKey' in col) {
				return columnVisibility[col.accessorKey as string] !== false
			}
			return true
		})
		await exportToExcel({
			columns: visibleColumns,
			data: filteredData,
			fileName,
			sheetName,
		})
	}, [columns, filteredData, fileName, sheetName, columnVisibility])

	const handleExportSelected = useCallback(async () => {
		const visibleColumns = columns.filter((col) => {
			if ('accessorKey' in col) {
				return columnVisibility[col.accessorKey as string] !== false
			}
			return true
		})
		const selectedRows = filteredData.filter(
			(_, index) => rowSelection[index as keyof typeof rowSelection],
		)
		await exportToExcel({
			columns: visibleColumns,
			data: selectedRows,
			fileName,
			sheetName,
		})
	}, [
		columns,
		filteredData,
		rowSelection,
		fileName,
		sheetName,
		columnVisibility,
	])

	const handleResetColumnSizes = useCallback(() => {
		setColumnSizing({})
	}, [])

	const handleColumnToggle = useCallback((columnId: string) => {
		setColumnVisibility((prev) => ({
			...prev,
			[columnId]: !prev[columnId],
		}))
	}, [])

	const handleShowAllColumns = useCallback(() => {
		setColumnVisibility({})
	}, [])

	const handleHideAllColumns = useCallback(() => {
		const hidden: VisibilityState = {}
		table.getAllLeafColumns().forEach((col) => {
			hidden[col.id] = false
		})
		setColumnVisibility(hidden)
	}, [table])

	const handleSearchChange = useCallback(
		(value: string) => {
			setGlobalFilter(value)
			if (enableAsync) {
				setPagination((prev) => ({ ...prev, pageIndex: 0 }))
			}
		},
		[enableAsync],
	)

	const handleAsyncSearch = useDebouncedCallback((value: string) => {
		onSearchChange?.(value)
	}, searchDebounceMs)

	const handleSearchInput = useCallback(
		(value: string) => {
			handleSearchChange(value)
			if (enableAsync) {
				handleAsyncSearch(value)
			}
		},
		[enableAsync, handleSearchChange, handleAsyncSearch],
	)

	const handlePageChange = useCallback(
		(page: number) => {
			setPagination((prev) => ({ ...prev, pageIndex: page - 1 }))
			if (enableAsync) {
				onPaginationChange?.(page, pagination.pageSize)
			}
		},
		[enableAsync, onPaginationChange, pagination.pageSize],
	)

	const handlePageSizeChange = useCallback(
		(size: number) => {
			setPagination((prev) => ({ ...prev, pageSize: size, pageIndex: 0 }))
			if (enableAsync) {
				onPaginationChange?.(1, size)
			}
		},
		[enableAsync, onPaginationChange],
	)

	const columnVisibilityData = useMemo(
		() =>
			table.getAllLeafColumns().map((col) => ({
				id: col.id,
				header:
					typeof col.columnDef.header === 'string'
						? col.columnDef.header
						: col.id,
				isVisible: col.getIsVisible(),
			})),
		[table, columnVisibility],
	)

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

	const selectedCount = Object.keys(rowSelection).length
	const hasResizedColumns = Object.keys(columnSizing).length > 0

	return (
		<div className='border rounded-3 p-1 w-100 d-flex flex-column' style={{ minWidth: 0, height: '100%' }}>
			<h1 className='fs-2'>Titulo de la tabla</h1>

			<div className='d-flex align-items-center justify-content-between mb-2 gap-2'>
				<div className='d-flex align-items-center gap-2'>
					{enableSearch && (
						<SearchFilter value={globalFilter} onChange={handleSearchInput} />
					)}
					{selectedCount > 0 && (
						<small className='text-muted'>
							{selectedCount} fila{selectedCount > 1 ? 's' : ''} seleccionada
							{selectedCount > 1 ? 's' : ''}
						</small>
					)}
				</div>

				<div className='d-flex gap-1'>
					{enableExport && (
						<Dropdown>
							<Dropdown.Toggle
								variant='secondary'
								size='sm'
								id='export-dropdown'
							>
								Export
							</Dropdown.Toggle>
							<Dropdown.Menu style={{ zIndex: 9999 }}>
								<Dropdown.Item onClick={handleExportAll}>
									Exportar todo
								</Dropdown.Item>
								<Dropdown.Item onClick={handleExportVisible}>
									Exportar columnas visibles
								</Dropdown.Item>
								{enableRowSelection && selectedCount > 0 && (
									<Dropdown.Item onClick={handleExportSelected}>
										Exportar seleccionadas ({selectedCount})
									</Dropdown.Item>
								)}
							</Dropdown.Menu>
						</Dropdown>
					)}
					{enableColumnVisibility && (
						<ColumnVisibilityToggle
							columns={columnVisibilityData}
							onToggle={handleColumnToggle}
							onShowAll={handleShowAllColumns}
							onHideAll={handleHideAllColumns}
						/>
					)}
					{enableColumnResize && hasResizedColumns && (
						<Button
							onClick={handleResetColumnSizes}
							variant='secondary'
							size='sm'
							title='Reset column sizes'
						>
							<Maximize2 size={16} />
						</Button>
					)}
					{onRefetchFn && (
						<Button onClick={onRefetchFn} variant='secondary' size='sm'>
							<RotateCcw size={16} />
						</Button>
					)}
					{onAddFn && (
						<Button onClick={onAddFn} variant='primary' size='sm'>
							<Plus size={16} />
						</Button>
					)}
				</div>
			</div>

			<div
				style={{
					overflowX: 'auto',
					overflowY: 'auto',
					flex: 1,
					minHeight: 0,
					position: 'relative',
					minWidth: 0,
				}}
			>
				<Table
					className='mb-0 table-striped table-hover'
					style={{ width: '100%' }}
					{...props}
				>
					<thead style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'var(--bs-body-bg)' }}>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{enableRowSelection && (
									<th
										style={{
											width: 40,
											position: 'sticky',
											top: 0,
											zIndex: 20,
											backgroundColor: 'var(--bs-body-bg)',
										}}
									>
										<input
											type='checkbox'
											checked={table.getIsAllPageRowsSelected()}
											ref={(el) => {
												if (el)
													el.indeterminate = table.getIsSomePageRowsSelected()
											}}
											onChange={table.getToggleAllPageRowsSelectedHandler()}
										/>
									</th>
								)}
								{headerGroup.headers.map((header) => {
									const pinned = header.column.getIsPinned()
									const canSort = header.column.getCanSort()
									const sortDir = header.column.getIsSorted()

									return (
										<th
											key={header.id}
											style={{
												...getPinnedStyle({
													column: header.column,
													isHeader: true,
													columnPinning,
													bgColor,
													stripedBg,
												}),
												position: 'sticky',
												top: 0,
												backgroundColor: pinned ? bgColor : 'var(--bs-body-bg)',
												cursor: canSort ? 'pointer' : undefined,
												userSelect: 'none',
												width: header.column.getSize(),
											}}
											onClick={
												canSort
													? header.column.getToggleSortingHandler()
													: undefined
											}
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
												<div className='d-flex align-items-center gap-1'>
													{canSort && (
														<span className='text-muted'>
															{sortDir === 'asc' ? (
																<ArrowUp size={14} />
															) : sortDir === 'desc' ? (
																<ArrowDown size={14} />
															) : (
																<ArrowUpDown size={14} />
															)}
														</span>
													)}
													{header.column.getCanPin() && (
														<Dropdown
															align='end'
															onClick={(e) => e.stopPropagation()}
														>
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
												{enableColumnResize && header.column.getCanResize() && (
													<div
														onMouseDown={header.getResizeHandler()}
														onTouchStart={header.getResizeHandler()}
														className={`resizer ${header.column.getIsResizing() ? 'is-resizing' : ''}`}
														style={{
															position: 'absolute',
															right: 0,
															top: 0,
															height: '100%',
															width: '5px',
															background: header.column.getIsResizing()
																? '#0d6efd'
																: 'transparent',
															cursor: 'col-resize',
															userSelect: 'none',
															touchAction: 'none',
														}}
													/>
												)}
											</div>
										</th>
									)
								})}
							</tr>
						))}
					</thead>
					{isLoading ? (
						<TableSkeleton
							rows={pagination.pageSize}
							columns={columns.length + (enableRowSelection ? 1 : 0)}
						/>
					) : filteredData.length === 0 ? (
						<TableEmpty
							colSpan={
								table.getAllLeafColumns().length + (enableRowSelection ? 1 : 0)
							}
						/>
					) : (
						<tbody>
							{table.getRowModel().rows.map((row) => (
								<tr
									key={row.id}
									onClick={() => onRowClick?.(row.original)}
									style={{ cursor: onRowClick ? 'pointer' : undefined }}
									className={row.getIsSelected() ? 'table-active' : ''}
								>
									{enableRowSelection && (
										<td style={{ width: 40 }}>
											<input
												type='checkbox'
												checked={row.getIsSelected()}
												onChange={row.getToggleSelectedHandler()}
												onClick={(e) => e.stopPropagation()}
											/>
										</td>
									)}
									{row.getVisibleCells().map((cell) => {
										const enableCopy = cell.column.columnDef.meta?.enableCopy
										const cellValue = cell.getValue()
										const isCopied = copiedCellId === cell.id

										return (
											<td
												key={cell.id}
												style={getPinnedStyle({
													column: cell.column,
													rowIndex: row.index,
													columnPinning,
													bgColor,
													stripedBg,
												})}
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
															onClick={(e) => {
																e.stopPropagation()
																handleCopy(cell.id, cellValue)
															}}
														>
															{isCopied ? (
																<Check size={14} className='text-success' />
															) : (
																<Copy size={14} />
															)}
														</Button>
													)}
												</div>
											</td>
										)
									})}
								</tr>
							))}
						</tbody>
					)}
				</Table>
			</div>

			<PaginationTable
				page={pagination.pageIndex + 1}
				totalPages={totalPages}
				pageSize={pagination.pageSize}
				pageSizeOptions={pageSizeOptions}
				onPageChange={handlePageChange}
				onPageSizeChange={handlePageSizeChange}
			/>
		</div>
	)
}
