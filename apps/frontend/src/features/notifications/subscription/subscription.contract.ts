import z from 'zod';

export const PushSubscriptionSchema = z.object({
	info_endpoint: z
		.string()
		.nonempty({ message: 'Info endpoint не может быть пустым' }),
	info_keys_p256dh: z
		.string()
		.nonempty({ message: 'Info keys p256dh не может быть пустым' }),
	info_keys_auth: z
		.string()
		.nonempty({ message: 'Info keys auth не может быть пустым' }),
	browser: z.string().nullable().optional(),
	device: z.string().nullable().optional()
});

export type PushSubscriptionDto = z.infer<typeof PushSubscriptionSchema>;
