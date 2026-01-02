import z from 'zod';
import { StoreCreateSchema } from '../create/store-create.contract';

export const UpdateStoreSchema = StoreCreateSchema.omit({
	logo: true,
	is_read_policy: true
}).extend({
	logo: z
		.instanceof(File, {
			message: 'Логотип должен быть файлом'
		})
		.nullable()
		.optional()
});

export type UpdateStoreDto = z.infer<typeof UpdateStoreSchema>;
