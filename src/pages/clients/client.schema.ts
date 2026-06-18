import { z } from 'zod'

export const clientSchema = z.object({
	type: z.enum(['individual', 'company']),
	name: z.string().min(1, 'Name is required'),
	companyName: z.string().optional(),
	phone: z.string().min(1, 'Phone is required'),
	email: z.string().email('Invalid email'),
	address: z.string().min(1, 'Address is required'),
	notes: z.string().optional(),
})

export type ClientFormData = z.infer<typeof clientSchema>
