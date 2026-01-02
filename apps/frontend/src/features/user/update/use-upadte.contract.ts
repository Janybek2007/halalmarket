import z from 'zod'
import { Email, Fullname, Phone } from '~/shared/api/schema'

export const UpdateUserSchema = z.object({
	full_name: Fullname.optional(),
	email: Email.optional(),
	phone: Phone.optional(),
	address: z.string().optional()
});

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>
