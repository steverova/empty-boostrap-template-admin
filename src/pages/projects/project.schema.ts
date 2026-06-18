import { z } from 'zod'

export const projectSchema = z.object({
	projectName: z.string().min(1, 'Project name is required'),
	description: z.string().min(10, 'Description must be at least 10 characters'),
	startDate: z.string().min(1, 'Start date is required'),
	endDate: z.string().min(1, 'End date is required'),
	status: z.enum(['active', 'inactive', 'development', 'maintenance', 'completed']),
	priority: z.enum(['low', 'medium', 'high']),
	repository: z.string().url('Invalid URL').or(z.literal('')).optional(),
	demoUrl: z.string().url('Invalid URL').or(z.literal('')).optional(),
	owner: z.string().min(1, 'Owner is required'),
	team: z.array(z.string()).min(1, 'At least one team member is required'),
	files: z.array(z.instanceof(File)).optional(),
})

export type ProjectFormData = z.infer<typeof projectSchema>
