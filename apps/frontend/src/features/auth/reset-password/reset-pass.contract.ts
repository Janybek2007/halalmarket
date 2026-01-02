import z from 'zod';
import { Password } from '~/shared/api/schema';

export const ResetPasswordSchema = z
	.object({
		newPassword: Password,
		confirmPassword: z
			.string()
			.nonempty({ message: 'Подтверждение пароля не может быть пустым' })
	})
	.refine(data => data.newPassword === data.confirmPassword, {
		message: 'Пароли не совпадают',
		path: ['confirmPassword']
	});

export type ResetPasswordDto = z.infer<typeof ResetPasswordSchema>;
