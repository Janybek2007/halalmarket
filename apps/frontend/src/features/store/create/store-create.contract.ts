import z from 'zod';

export const StoreCreateSchema = z.object({
	store_name: z
		.string()
		.nonempty({ message: 'Название магазина не может быть пустым' })
		.min(3, {
			message: 'Название магазина должно содержать не менее 3 символов'
		}),
	store_logo: z.instanceof(File, {
		message: 'Логотип должен быть файлом'
	}),
	is_read_policy: z.boolean().refine(val => val === true, {
		message: 'Вы должны принять политику'
	})
});

export type StoreCreateDto = z.infer<typeof StoreCreateSchema>;
