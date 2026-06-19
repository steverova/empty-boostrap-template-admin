export type ClientType = 'individual' | 'company'

export interface Client {
	id: string
	type: ClientType
	name: string
	companyName?: string
	phone: string
	email: string
	address: string
	country: string
	notes?: string
}
