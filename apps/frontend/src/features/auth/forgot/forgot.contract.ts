import z from 'zod';
import { Email } from '~/shared/api/schema';

export const ForgotSchema = z.object({
	email: Email
});

export type ForgotDto = z.infer<typeof ForgotSchema>;
