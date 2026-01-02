import z from 'zod';
import { Email, Fullname, Password, Phone } from '~/shared/api/schema';

export const RegisterSchema = z.object({
	email: Email,
	password: Password.min(6, {
		message: 'Пароль должен содержать не менее 8 символов'
	}),
	full_name: Fullname,
	phone: Phone
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
