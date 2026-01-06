import { z } from 'zod';

export const Email = z
	.string('Введите это поле')
	.nonempty('Электронная почта не может быть пустой')
	.min(3, {
		message: 'Электронная почта должна содержать не менее 3 символов'
	})
	.email('Неверный адрес электронной почты');

export const PasswordRequired = z
	.string('Введите это поле')
	.nonempty('Пароль не может быть пустым');

export const Password = z
	.string('Введите это поле')
	.nonempty('Пароль не может быть пустым')
	.min(6, 'Пароль должен содержать минимум 6 символов');

export const Fullname = z
	.string('Введите это поле')
	.nonempty('ФИО не может быть пустым')
	.min(2, 'ФИО должно содержать не менее 2 символов');

export const Phone = z
	.string('Введите это поле')
	.nonempty('Телефон не может быть пустым')
	.refine(val => /^996\s\d{3}\s\d{3}\s\d{3}$/.test(val), {
		message: 'Телефон должен быть в формате 996 xxx xxx xxx'
	});

export const Identifier = z
	.string('Введите это поле')
	.nonempty('Идентификатор не может быть пустым')
	.superRefine((val, ctx) => {
		const firstChar = val.charAt(0);
		const isDigit = /^\d$/.test(firstChar);

		let isValid = false;

		if (isDigit) {
			const phoneResult = Phone.safeParse(val);
			isValid = phoneResult.success;

			if (!isValid) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Телефон должен быть в формате 996 xxx xxx xxx'
				});
			}
		} else {
			const emailResult = Email.safeParse(val);
			isValid = emailResult.success;

			if (!isValid) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Неверный адрес электронной почты'
				});
			}
		}

		if (!isValid) {
			return z.NEVER;
		}
	});

export const DateSchema = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/)
	.nullable()
	.optional();
