import { z } from 'zod'
import { collaboratorRoles } from './collaborator.types'

export const collaboratorSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	email: z.string().email('Invalid email'),
	role: z.enum(collaboratorRoles, { required_error: 'Role is required' }),
	phone: z.string().optional(),
})

export type CollaboratorFormData = z.infer<typeof collaboratorSchema>
