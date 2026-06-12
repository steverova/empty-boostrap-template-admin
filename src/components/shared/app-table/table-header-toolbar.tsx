import { FileSpreadsheet, List, Plus, RotateCcw, Search } from 'lucide-react'
import { Button, Form, InputGroup } from 'react-bootstrap'

type TableHeaderToolbarProps = {
	isRefetching?: boolean
	onRefetchFn?: () => void
	onAddFn?: () => void
	onExportFn?: () => void
}

export default function TableHeaderToolbar({
	isRefetching = false,
	onRefetchFn,
	onAddFn,
	onExportFn,
}: TableHeaderToolbarProps) {
	return (
		<div className='d-flex align-items-center justify-content-between mb-2'>
			<Form>
				<Form.Group className='' controlId='exampleForm.ControlInput1'>
					<InputGroup className=''>
						<InputGroup.Text id='inputGroup-sizing-sm'>
							<Search size={16} />
						</InputGroup.Text>
						<Form.Label className='visually-hidden'>Search</Form.Label>
						<Form.Control type='email' placeholder='search...' />
					</InputGroup>
				</Form.Group>
			</Form>

			<div className='d-flex gap-1'>
				<Button onClick={onExportFn} variant='secondary' size='sm'>
					<FileSpreadsheet size={16} />
				</Button>

				<Button variant='secondary' size='sm'>
					<List size={16} />
				</Button>

				<Button onClick={onRefetchFn} variant='secondary' size='sm'>
					<RotateCcw
						className={`${isRefetching && 'rotate-spin-reverse'}`}
						size={16}
					/>
				</Button>

				<Button onClick={onAddFn} variant='primary' size='sm'>
					<Plus size={16} />
				</Button>
			</div>
		</div>
	)
}
