import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { SuccessResponse } from '~/global';
import { http } from '~/shared/api/http';
import { RoutePaths } from '~/shared/router';
import { ResetPasswordDto, ResetPasswordSchema } from './reset-pass.contract';

export const useResetPasswordMutation = (props: { token: string }) => {
	const form = useForm<ResetPasswordDto>({
		resolver: zodResolver(ResetPasswordSchema)
	});
	const router = useRouter();

	const {
		mutateAsync,
		error: apiError,
		isPending
	} = useMutation({
		mutationKey: ['auth-reset-password'],
		mutationFn: (parsedBody: ResetPasswordDto) =>
			http.patch<SuccessResponse>('auth/reset-password/', {
				new_password: parsedBody.newPassword,
				confirm_password: parsedBody.confirmPassword,
				token: props.token
			})
	});

	const onSubmit = React.useCallback(
		(data: ResetPasswordDto) => {
			if (!props.token) {
				toast.error('Отсутствует токен');
				return;
			}
			toast.promise(
				async () => {
					const r = await mutateAsync(data);
					if (r.success) {
						toast.success('Пароль успешно сброшен');
						setTimeout(() => {
							router.push(RoutePaths.Auth.Login);
						}, 500);
					}
				},
				{ loading: 'Сброс пароля...' }
			);
		},
		[mutateAsync, props.token]
	);
	return {
		onsubmit: form.handleSubmit(onSubmit),
		apiError,
		isPending,
		form
	};
};
