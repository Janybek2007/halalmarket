import z from 'zod';

export const ProductCreateSchema = z.object({
	name: z
		.string()
		.nonempty({ message: 'Название продукта не может быть пустым' })
		.min(3), // Название продукта
	images: z
		.array(
			z.object({
				file: z.instanceof(File).optional(),
				url: z.string().optional(),
				isDeleted: z.boolean().optional(),
				id: z.int().optional()
			})
		)
		.min(1, 'Минимальное количество изображений - 1'), // Изображение продукта
	price: z
		.union([z.number().min(0), z.string()])
		.transform(val => Number(val))
		.nullable()
		.optional(), // Цена продукта
	discount: z
		.string()
		.nonempty({ message: 'Скидка не может быть пустой' })
		.min(0)
		.max(100)
		.default('0'), // Скидка
	description: z.string().nullable().optional(), // Описание
	subcategory: z.int({ message: 'Укажите категорию продукта' }), // Подкатегория
	country: z.string().nullable().optional(), // Страна
	code: z.string().nullable().optional(), // Код
	composition: z.string().nullable().optional(), // Состав
	expiration_date: z.string().nullable().optional(), // Срок годности
	equipment: z.string().nullable().optional(), // Комплектация
	action: z.string().nullable().optional(), // Действие
	items_in_package: z
		.union([z.number(), z.string()])
		.transform(val => Number(val))
		.nullable()
		.optional() // Количество продуктов
});

export const ProductUpdateSchema = ProductCreateSchema.extend({
	id: z.int()
});

export type ProductCreateDto = z.infer<typeof ProductCreateSchema>;
export type ProductUpdateDto = z.infer<typeof ProductUpdateSchema>;
