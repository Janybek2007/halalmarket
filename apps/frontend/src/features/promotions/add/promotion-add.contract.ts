import z from 'zod';

export const PromotionRequestSchema = z.object({
	products: z
		.array(z.int())
		.nonempty({ message: 'Продукт не может быть пустым' }),
	discount: z.string().nonempty({ message: 'Discount не может быть пустым' }),
	thumbnail: z.instanceof(File).optional(),
	expires_at: z
		.string()
		.nonempty({ message: 'Expires at не может быть пустым' })
});

export type PromotionRequestDto = z.infer<typeof PromotionRequestSchema>;
