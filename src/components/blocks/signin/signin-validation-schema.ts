import { z } from 'zod/v4'

export const signInschema = z.object({
	email: z.email('Ingrese un correo electrónico válido'),
	password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export type SignInValues = z.infer<typeof signInschema>
