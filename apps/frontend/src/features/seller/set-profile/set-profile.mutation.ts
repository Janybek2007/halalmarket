import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { SuccessResponse } from '~/global';
import { http } from '~/shared/api/http';
import { RoutePaths } from '~/shared/router';
import { SetProfileDto, SetProfileSchema } from './set-profile.contract';

export const useSetProfileMutation = () => {
	const sp = useSearchParams();
	const token = sp.get('token');
	const email = sp.get('email') || '';

	const form = useForm<SetProfileDto>({
		resolver: zodResolver(SetProfileSchema),
		defaultValues: {
			token: token || '',
			email
		}
	});

	const router = useRouter();

	const {
		mutateAsync,
		error: apiError,
		isPending
	} = useMutation({
		mutationKey: ['set-profile_seller', token],
		mutationFn: (parsedBody: SetProfileDto) =>
			http.post<SuccessResponse>('seller/set-profile/', {
				token: parsedBody.token,
				password: parsedBody.password,
				profile_fullname: parsedBody.fullname,
				profile_email: parsedBody.email
			})
	});

	const onSubmit = React.useCallback(
		async (data: SetProfileDto) => {
			toast.promise(
				(async () => {
					const { success } = await mutateAsync(data);
					if (success) {
						toast.success('Профиль успешно установлен');
						setTimeout(() => router.push(RoutePaths.Auth.Login), 300);
					}
				})(),
				{ loading: 'Установка профиля...' }
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
