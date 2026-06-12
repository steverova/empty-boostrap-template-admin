import {
	type ColumnDef,
	type ColumnPinningState,
	getCoreRowModel,
	getPaginationRowModel,
	type PaginationState,
	useReactTable,
} from '@tanstack/react-table'
import { ArrowLeft, ArrowRight, Pin, PinOff } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Button, Dropdown } from 'react-bootstrap'
import type { TableProps } from 'react-bootstrap/Table'
import Table from 'react-bootstrap/Table'
import { useThemeMode } from '../../../hooks/use-theme-mode'
import { PaginationTable } from './pagination-table'
import TableHeaderToolbar from './table-header-toolbar'
import { DEFAULT_PAGE_SIZE_OPTIONS } from './table-helper'

export type { ColumnDef } from '@tanstack/react-table'

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
}

export default function AppTable<T extends Record<string, any>>({
	columns,
	data,
	pageSize: initialPageSize = 10,
	pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
	...props
}: AppTableProps<T>) {
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: initialPageSize,
	})

	const [columnPinning, setColumnPinning] =
		useState<ColumnPinningState>(loadPinning)

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

	const getPinnedStyle = (
		column: any,
		isHeader: boolean = false,
		rowIndex: number = 0,
	): React.CSSProperties => {
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

	return (
		<div className='border rounded-3 p-1'>
			<h1 className='fs-2'>Titulo de la tabla</h1>

			<TableHeaderToolbar />

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
												position: 'sticky',
												top: 0,
												zIndex: pinned ? 10 : 1,
												backgroundColor: 'var(--bs-body-bg)',
												minWidth: 100,
												...getPinnedStyle(header.column, true),
											}}
											{...header.column.columnDef.meta}
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
								{row.getVisibleCells().map((cell) => (
									<td
										key={cell.id}
										style={getPinnedStyle(cell.column, false, row.index)}
										{...cell.column.columnDef.meta}
									>
										{typeof cell.column.columnDef.cell === 'function'
											? cell.column.columnDef.cell(cell.getContext())
											: cell.getValue()}
									</td>
								))}
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
