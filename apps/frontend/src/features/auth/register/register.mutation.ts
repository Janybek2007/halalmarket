import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { http } from '~/shared/api/http';
import { TokenUtils } from '~/shared/api/token.client';
import { useQueryString } from '~/shared/hooks';
import { queryClient } from '~/shared/libs/tanstack';
import { RoutePaths } from '~/shared/router';
import { AuthResponse } from '../types';
import { RegisterDto, RegisterSchema } from './register.contract';

export const useRegisterMutation = () => {
	const form = useForm<RegisterDto>({
		resolver: zodResolver(RegisterSchema)
	});
	const router = useRouter();
	const [redirectVal] = useQueryString('redirect', RoutePaths.Guest.Home);

	const {
		mutateAsync,
		error: apiError,
		isPending
	} = useMutation({
		mutationKey: ['auth-register'],
		mutationFn: async (data: RegisterDto) =>
			http.post<AuthResponse>('auth/register/', data),
		onSuccess(data) {
			TokenUtils.Save(data.tokens);
			setTimeout(() => {
				queryClient.refetchQueries({});
			}, 200);
		}
	});

	const onSubmit = React.useCallback(
		async (data: RegisterDto) => {
			toast.promise(
				async () => {
					const r = await mutateAsync(data);
					if (r?.user_id) {
						setTimeout(() => {
							router.push(RoutePaths.Guest.Home);
						}, 500);
					}
				},
				{ loading: 'Регистрация...', success: 'Вы успешно зарегистрировались' }
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
