export const collaboratorRoles = ['developer', 'qa', 'design', 'chief', 'administrator'] as const
export type CollaboratorRole = (typeof collaboratorRoles)[number]

export const collaboratorTypes = ['internal', 'external'] as const
export type CollaboratorType = (typeof collaboratorTypes)[number]

export interface Collaborator {
	id: string
	type: CollaboratorType
	clientId?: string
	firstName: string
	lastName: string
	email: string
	role: CollaboratorRole
	phone?: string
}
