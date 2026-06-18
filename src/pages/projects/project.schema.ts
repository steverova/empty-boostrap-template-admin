import { z } from 'zod'

export const projectSchema = z.object({
	type: z.enum(['individual', 'company']),
	companyName: z.string().optional(),
	contactName: z.string().min(1, 'Contact name is required'),
	phone: z.string().min(1, 'Phone is required'),
	email: z.string().email('Invalid email'),
	address: z.string().min(1, 'Address is required'),
	projectName: z.string().min(1, 'Project name is required'),
	description: z.string().min(10, 'Description must be at least 10 characters'),
	startDate: z.string().min(1, 'Start date is required'),
	endDate: z.string().min(1, 'End date is required'),
	status: z.enum(['active', 'inactive', 'development', 'maintenance', 'completed']),
	priority: z.enum(['low', 'medium', 'high']),
	documentation: z.string().url('Invalid URL').or(z.literal('')).optional(),
	repository: z.string().url('Invalid URL').or(z.literal('')).optional(),
	demoUrl: z.string().url('Invalid URL').or(z.literal('')).optional(),
	owner: z.string().min(1, 'Owner is required'),
	team: z.array(z.string()).min(1, 'At least one team member is required'),
})

export type ProjectFormData = z.infer<typeof projectSchema>
