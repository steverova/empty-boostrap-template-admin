import { z } from 'zod'

export const timeEntrySchema = z
	.object({
		category: z.enum(['actividad_empresarial', 'enfermedad', 'operacional', 'vacaciones']),
		day: z.string().min(1, 'Day is required'),
		comment: z.string().min(1, 'Comment is required'),
		hours: z.number().optional(),
		hourType: z.enum(['develop', 'qa', 'design', 'mantenimiento']).optional(),
		clientId: z.string().optional(),
		projectId: z.string().optional(),
		taskId: z.string().optional(),
	})
	.superRefine((data, ctx) => {
		if (data.category === 'operacional') {
			if (!data.hours || data.hours <= 0) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Hours are required for operational entries',
					path: ['hours'],
				})
			}
			if (!data.hourType) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Hour type is required for operational entries',
					path: ['hourType'],
				})
			}
			if (!data.clientId) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Client is required for operational entries',
					path: ['clientId'],
				})
			}
			if (!data.projectId) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Project is required for operational entries',
					path: ['projectId'],
				})
			}
			if (!data.taskId) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Task is required for operational entries',
					path: ['taskId'],
				})
			}
		}
	})

export type TimeEntryFormData = z.infer<typeof timeEntrySchema>
