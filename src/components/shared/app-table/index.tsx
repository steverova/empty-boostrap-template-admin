import { useMemo, useState } from 'react'
import type { TableProps } from 'react-bootstrap/Table'
import Table from 'react-bootstrap/Table'
import { PaginationTable } from './pagination-table'
import TableHeaderToolbar from './table-header-toolbar'
import { DEFAULT_PAGE_SIZE_OPTIONS } from './table-helper'

export interface Column<T> {
	key: keyof T & string
	label: string
	headerProps?: React.ThHTMLAttributes<HTMLTableCellElement>
	cellProps?: React.TdHTMLAttributes<HTMLTableCellElement>
	render?: (value: T[keyof T], row: T) => React.ReactNode
}

export interface AppTableProps<T extends Record<string, any>>
	extends Omit<TableProps, 'onSelect'> {
	columns: Column<T>[]
	data: T[]
	onRefetchFn?: () => void
	onAddFn?: () => void
	keyField?: keyof T & string
	pageSize?: number
	pageSizeOptions?: number[]
}

export default function AppTable<T extends Record<string, any>>({
	columns,
	data,
	keyField = 'id' as keyof T & string,
	pageSize: initialPageSize = 10,
	pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
	...props
}: AppTableProps<T>) {
	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(initialPageSize)

	const totalPages = Math.ceil(data.length / pageSize)

	const pagedData = useMemo(() => {
		const start = (page - 1) * pageSize
		return data.slice(start, start + pageSize)
	}, [data, page, pageSize])

	const handlePageSizeChange = (size: number) => {
		setPageSize(size)
		setPage(1)
	}

	return (
		<div className='border rounded-3 p-1'>
			<h1 className='fs-2'>Titulo de la tabla</h1>

			<TableHeaderToolbar />

			<Table className='' {...props}>
				<thead>
					<tr>
						{columns.map((col) => (
							<th key={col.key} {...col.headerProps}>
								{col.label}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{pagedData.map((row) => (
						<tr key={String(row[keyField])}>
							{columns.map((col) => (
								<td key={col.key} {...col.cellProps}>
									{col.render
										? col.render(row[col.key], row)
										: String(row[col.key] ?? '')}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</Table>
			{totalPages > 1 && (
				<PaginationTable
					page={page}
					totalPages={totalPages}
					pageSize={pageSize}
					pageSizeOptions={pageSizeOptions}
					onPageChange={setPage}
					onPageSizeChange={handlePageSizeChange}
				/>
			)}
		</div>
	)
}
