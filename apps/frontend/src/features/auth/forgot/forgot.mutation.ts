import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { SuccessResponse } from '~/global';
import { http } from '~/shared/api/http';
import { RoutePaths } from '~/shared/router';
import { ForgotDto, ForgotSchema } from './forgot.contract';

export const useForgotMutation = () => {
	const form = useForm<ForgotDto>({
		resolver: zodResolver(ForgotSchema)
	});
	const router = useRouter();

	const {
		mutateAsync,
		error: apiError,
		isPending
	} = useMutation({
		mutationKey: ['auth-forgot'],
		mutationFn: async (parsedBody: ForgotDto) =>
			http.post<SuccessResponse>('auth/forgot/', parsedBody)
	});

	const onSubmit = React.useCallback(
		(data: ForgotDto) => {
			toast.promise(
				async () => {
					const r = await mutateAsync(data);
					if (r.success) {
						toast.success('Письмо отправлено на указанный email');
						setTimeout(() => {
							router.push(RoutePaths.Auth.Login);
						}, 300);
					}
				},
				{ loading: 'Отправка запроса...', error: 'Ошибка при отправке запроса' }
			);
		},
		[mutateAsync]
	);
	return {
		onsubmit: form.handleSubmit(onSubmit),
		apiError,
		isPending,
		form
	};
};
