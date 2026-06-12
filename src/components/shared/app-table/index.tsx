import { useMemo, useState } from 'react'
import {
	useReactTable,
	getCoreRowModel,
	getPaginationRowModel,
	type ColumnDef,
	type PaginationState,
} from '@tanstack/react-table'
import type { TableProps } from 'react-bootstrap/Table'
import Table from 'react-bootstrap/Table'
import { PaginationTable } from './pagination-table'
import TableHeaderToolbar from './table-header-toolbar'
import { DEFAULT_PAGE_SIZE_OPTIONS } from './table-helper'

export type { ColumnDef } from '@tanstack/react-table'

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

	const table = useReactTable({
		data,
		columns,
		state: {
			pagination,
		},
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	})

	const totalPages = table.getPageCount()

	return (
		<div className='border rounded-3 p-1'>
			<h1 className='fs-2'>Titulo de la tabla</h1>

			<TableHeaderToolbar />

			<div className='table-responsive'>
				<Table {...props}>
				<thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<th key={header.id} {...header.column.columnDef.meta}>
									{header.isPlaceholder
										? null
										: typeof header.column.columnDef.header === 'function'
											? header.column.columnDef.header(header.getContext())
											: header.column.columnDef.header}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody>
					{table.getRowModel().rows.map((row) => (
						<tr key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<td key={cell.id} {...cell.column.columnDef.meta}>
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
					onPageChange={(page) => setPagination((prev) => ({ ...prev, pageIndex: page - 1 }))}
					onPageSizeChange={(size) =>
						setPagination((prev) => ({ ...prev, pageSize: size, pageIndex: 0 }))
					}
				/>
			)}
		</div>
	)
}
