import { Search } from 'lucide-react'
import { Form, InputGroup } from 'react-bootstrap'

interface SearchFilterProps {
	value: string
	onChange: (value: string) => void
	placeholder?: string
}

export function SearchFilter({
	value,
	onChange,
	placeholder = 'search...',
}: SearchFilterProps) {
	return (
		<Form>
			<Form.Group controlId='table-search'>
				<InputGroup>
					<InputGroup.Text>
						<Search size={16} />
					</InputGroup.Text>
					<Form.Label className='visually-hidden'>Search</Form.Label>
					<Form.Control
						type='text'
						placeholder={placeholder}
						value={value}
						onChange={(e) => onChange(e.target.value)}
					/>
				</InputGroup>
			</Form.Group>
		</Form>
	)
}
