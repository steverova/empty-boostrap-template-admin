import { Search, X } from 'lucide-react'
import { Container, Form, InputGroup, ListGroup } from 'react-bootstrap'
import IconButton from './icon-button'

type GlobalSearchProps = {
	open: boolean
	onClose: () => void
}

export default function GlobalSearch({ open, onClose }: GlobalSearchProps) {
	if (!open) return null

	return (
		<div
			className='position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center bg-dark bg-opacity-75'
			style={{ zIndex: 1055 }}
		>
			<IconButton
				aria-label='close'
				className='position-absolute top-0 end-0 m-3 shadow'
				onClick={onClose}
			>
				<X className='text-white' />
			</IconButton>

			<Container className='mt-5'>
				<InputGroup className='mt-5 mb-3'>
					<InputGroup.Text id='global-search'>
						<Search />
					</InputGroup.Text>

					<Form.Control
						placeholder='Search...'
						aria-label='global-search'
						aria-describedby='global-search'
					/>
				</InputGroup>

				<ListGroup>
					<ListGroup.Item>Cras justo odio</ListGroup.Item>
					<ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
					<ListGroup.Item>Morbi leo risus</ListGroup.Item>
					<ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
          <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
          <ListGroup.Item>Cras justo odio</ListGroup.Item>
					<ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
					<ListGroup.Item>Morbi leo risus</ListGroup.Item>
					<ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
					<ListGroup.Item>Vestibulum at eros</ListGroup.Item>
				</ListGroup>
			</Container>
		</div>
	)
}
