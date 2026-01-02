import z from 'zod';
import { Phone } from '~/shared/api/schema';

export const SellerRequestSchema = z.object({
	phone: Phone
});

export type SellerRequestDto = z.infer<typeof SellerRequestSchema>;
