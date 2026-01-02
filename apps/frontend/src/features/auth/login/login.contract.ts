import z from 'zod';
import { Identifier, Password } from '~/shared/api/schema';

export const LoginSchema = z.object({
	identifier: Identifier,
	password: Password
});

export type LoginDto = z.infer<typeof LoginSchema>;
