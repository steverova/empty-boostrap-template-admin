import { z } from 'zod'
import { collaboratorRoles, collaboratorTypes } from './collaborator.types'

export const collaboratorSchema = z.object({
	type: z.enum(collaboratorTypes, { message: 'Type is required' }),
	clientId: z.string().optional(),
	firstName: z.string().min(1, 'First name is required'),
	lastName: z.string().min(1, 'Last name is required'),
	email: z.string().email('Invalid email'),
	role: z.enum(collaboratorRoles, { message: 'Role is required' }),
	phone: z.string().optional(),
})

export type CollaboratorFormData = z.infer<typeof collaboratorSchema>
