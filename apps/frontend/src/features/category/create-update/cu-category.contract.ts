import z from 'zod';

export const CUCategorySchema = z.object({
	name: z
		.string()
		.nonempty({ message: 'Название категории не может быть пустым' })
		.min(3, {
			message: 'Название категории должно содержать не менее 3 символов'
		}),
	image: z
		.union([z.instanceof(File), z.string()])
		.nullable()
		.optional(),
	parent_id: z.int().optional(),
	order: z.string().optional(),
	slug: z.string().optional()
});

export type CUCategoryDto = z.infer<typeof CUCategorySchema>;
