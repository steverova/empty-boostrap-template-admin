import type { Collaborator } from '@/pages/collaborators/collaborator.types'

export const mockCollaborators: Collaborator[] = [
	{
		id: 'col1',
		name: 'John Doe',
		email: 'john@example.com',
		role: 'developer',
		phone: '+1 555 111 2222',
	},
	{
		id: 'col2',
		name: 'Jane Smith',
		email: 'jane@example.com',
		role: 'design',
		phone: '+1 555 333 4444',
	},
	{
		id: 'col3',
		name: 'Mike Johnson',
		email: 'mike@example.com',
		role: 'qa',
		phone: '+1 555 555 6666',
	},
	{
		id: 'col4',
		name: 'Sarah Williams',
		email: 'sarah@example.com',
		role: 'developer',
		phone: '+1 555 777 8888',
	},
	{
		id: 'col5',
		name: 'Tom Brown',
		email: 'tom@example.com',
		role: 'chief',
		phone: '+1 555 999 0000',
	},
]
