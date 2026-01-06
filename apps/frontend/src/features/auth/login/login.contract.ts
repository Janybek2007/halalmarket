import z from 'zod';
import { Identifier, PasswordRequired } from '~/shared/api/schema';

export const LoginSchema = z.object({
	identifier: Identifier,
	password: PasswordRequired
});

export type LoginDto = z.infer<typeof LoginSchema>;
