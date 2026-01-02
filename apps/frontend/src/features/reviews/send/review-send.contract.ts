import z from 'zod';

export const SendReviewSchema = z.object({
	rating: z
		.number('Введите оценку')
		.min(1, { message: 'Оценка должна быть от 1 до 5' })
		.max(5, { message: 'Оценка должна быть от 1 до 5' }),
	comment: z
		.string('Комментарий не может быть пустым')
		.nonempty('Комментарий не может быть пустым'),
	files: z.array(z.instanceof(File)).optional(),
	slug: z.string('Slug не может быть пустым')
});

export type SendReviewDto = z.infer<typeof SendReviewSchema>;
