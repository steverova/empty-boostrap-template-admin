import { Dropdown } from 'react-bootstrap'
import { LogOut, User } from 'lucide-react'
import AnimalAvatar from '../../shared/animal-avatar'

export default function UserMenu() {
	return (
		<Dropdown align='end'>
			<Dropdown.Toggle
				variant='link'
				className='d-flex align-items-center gap-2 text-decoration-none py-1'
				id='user-menu'
			>
				<span className='d-none d-md-inline fw-bold'>Steven Rojas</span>
				<AnimalAvatar name='Felipe' size={32} />
			</Dropdown.Toggle>

			<Dropdown.Menu>
				<Dropdown.Item href='/profile'>
					<User className='me-2' />
					Profile
				</Dropdown.Item>
				<Dropdown.Divider />
				<Dropdown.Item href='/logout'>
					<LogOut className='me-2' />
					Sign out
				</Dropdown.Item>
			</Dropdown.Menu>
		</Dropdown>
	)
}
