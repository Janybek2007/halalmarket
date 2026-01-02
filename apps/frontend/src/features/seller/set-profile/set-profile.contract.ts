import z from 'zod';
import { Email, Fullname, Password } from '~/shared/api/schema';

export const SetProfileSchema = z
	.object({
		password: Password,
		confirm_password: Password,
		token: z.string().nonempty({ message: 'Токен не может быть пустым' }),
		fullname: Fullname,
		email: Email
	})
	.refine(data => data.password === data.confirm_password, {
		message: 'Пароли не совпадают',
		path: ['confirm_password']
	});

export type SetProfileDto = z.infer<typeof SetProfileSchema>;
