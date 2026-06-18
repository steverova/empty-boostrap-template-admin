export const collaboratorRoles = ['developer', 'qa', 'design', 'chief'] as const
export type CollaboratorRole = (typeof collaboratorRoles)[number]

export interface Collaborator {
	id: string
	name: string
	email: string
	role: CollaboratorRole
	phone?: string
}
