import z from 'zod';
import { Password } from '~/shared/api/schema';

export const ChangePasswordSchema = z
	.object({
		old_password: Password,
		new_password: Password,
		confirm_password: Password
	})
	.refine(data => data.new_password === data.confirm_password, {
		message: 'Пароли не совпадают',
		path: ['confirm_password']
	});

export type ChangePasswordDto = z.infer<typeof ChangePasswordSchema>;
