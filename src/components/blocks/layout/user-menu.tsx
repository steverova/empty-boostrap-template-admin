import { LogOut, User } from 'lucide-react'
import { Dropdown } from 'react-bootstrap'
import { Avatar } from '../../shared/avatar'

export default function UserMenu() {
	return (
		<Dropdown align='end'>
			<Dropdown.Toggle
				variant='link'
				className='d-flex align-items-center gap-2 text-decoration-none py-1'
				id='user-menu'
			>
				<span className='d-none d-md-inline fw-bold'>Steven Rojas</span>
				<Avatar
					status='online'
					seed='Steve Rojas'
					name='Steven'
					variant='emoji'
					shape='circle'
					size='md'
				/>
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
