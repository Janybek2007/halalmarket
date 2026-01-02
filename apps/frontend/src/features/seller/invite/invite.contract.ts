import z from 'zod';
import { SuccessResponse } from '~/global'
import { Email, Phone } from '~/shared/api/schema';

export const SellerInviteSchema = z.object({
	phone: Phone,
	email: Email.optional()
});

export type SellerInviteDto = z.infer<typeof SellerInviteSchema>;

export type SellerInviteResult = {
	invite_url: string;
	expires_at: string;
} & SuccessResponse;
