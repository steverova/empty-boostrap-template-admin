import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo } from 'react'
import { Button } from 'react-bootstrap'
import Select, { type SingleValue } from 'react-select'
import { selectStyles } from './table-styles'

interface PaginationProps {
	page: number
	totalPages: number
	pageSize: number
	pageSizeOptions: number[]
	onPageChange: (page: number) => void
	onPageSizeChange: (size: number) => void
}

type Option = { value: number; label: string }

export const PaginationTable = ({
	page,
	totalPages,
	pageSize,
	pageSizeOptions,
	onPageChange,
	onPageSizeChange,
}: PaginationProps) => {
	const pageOptions = useMemo(
		() =>
			Array.from({ length: totalPages }, (_, i) => ({
				value: i + 1,
				label: String(i + 1),
			})),
		[totalPages],
	)

	const pageSizeOptionsFormatted = useMemo(
		() =>
			pageSizeOptions.map((size) => ({
				value: size,
				label: String(size),
			})),
		[pageSizeOptions],
	)

	return (
		<div className='d-flex align-items-center justify-content-between gap-2 mt-3 px-2' style={{ position: 'relative', zIndex: 10 }}>
			<div className='d-flex gap-1 align-items-center'>
				<Button
					size='sm'
					variant='outline-secondary'
					disabled={page <= 1}
					onClick={() => onPageChange(page - 1)}
				>
					<ChevronLeft size={18} />
				</Button>
				<Select<Option>
					menuPlacement='top'
					styles={selectStyles}
					value={pageOptions.find((o) => o.value === page)}
					options={pageOptions}
					onChange={(opt: SingleValue<Option>) => {
						if (opt) onPageChange(opt.value)
					}}
				/>
				<Button
					size='sm'
					variant='outline-secondary'
					disabled={page >= totalPages}
					onClick={() => onPageChange(page + 1)}
				>
					<ChevronRight size={18} />
				</Button>
			</div>

			<div className='d-flex align-items-center gap-1'>
				<Select<Option>
					menuPlacement='top'
					styles={selectStyles}
					value={pageSizeOptionsFormatted.find((o) => o.value === pageSize)}
					options={pageSizeOptionsFormatted}
					onChange={(opt: SingleValue<Option>) => {
						if (opt) onPageSizeChange(opt.value)
					}}
				/>
				<small className='text-nowrap'>por página</small>
			</div>
		</div>
	)
}
