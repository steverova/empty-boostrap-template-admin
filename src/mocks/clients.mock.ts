import type { Client } from '@/pages/clients/client.types'

export const mockClients: Client[] = [
	{
		id: 'cli1',
		type: 'company',
		name: 'Acme Corp',
		companyName: 'Acme Corporation',
		phone: '+1 555 100 2000',
		email: 'alice@acme.com',
		address: '123 Main St, New York, NY',
	},
	{
		id: 'cli2',
		type: 'individual',
		name: 'Bob Williams',
		phone: '+1 555 300 4000',
		email: 'bob@personal.dev',
		address: '456 Oak Ave, Austin, TX',
	},
	{
		id: 'cli3',
		type: 'company',
		name: 'TechCorp',
		companyName: 'TechCorp Solutions',
		phone: '+1 555 123 4567',
		email: 'contact@techcorp.com',
		address: '100 Tech Ave, San Francisco, CA',
	},
	{
		id: 'cli4',
		type: 'company',
		name: 'GreenLeaf',
		companyName: 'GreenLeaf Industries',
		phone: '+1 555 456 7890',
		email: 'info@greenleaf.com',
		address: '500 Green Blvd, Portland, OR',
	},
]
