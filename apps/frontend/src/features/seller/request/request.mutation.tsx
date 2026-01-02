import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { http } from '~/shared/api/http';
import { RoutePaths } from '~/shared/router';
import { SellerRequestDto, SellerRequestSchema } from './request.contrac';

export const useSellerRequestMutation = () => {
	const router = useRouter();
	const form = useForm<SellerRequestDto>({
		resolver: zodResolver(SellerRequestSchema)
	});

	const {
		mutateAsync,
		error: apiError,
		isPending
	} = useMutation({
		mutationKey: ['seller-request'],
		mutationFn: (parsedBody: SellerRequestDto) =>
			http.post<{ phone: string; expires_at: string }>(
				'seller/request/',
				parsedBody
			)
	});

	const onSubmit = React.useCallback(
		async (data: SellerRequestDto) => {
			toast.promise(
				(async () => {
					await mutateAsync(data);
					toast.success('Заявка отправлена', {
						description: 'Администратор свяжется с вами по указанному номеру'
					});
					setTimeout(() => {
						router.push(RoutePaths.Guest.Home);
					}, 500);
				})(),
				{ loading: 'Отправка заявки...' }
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
