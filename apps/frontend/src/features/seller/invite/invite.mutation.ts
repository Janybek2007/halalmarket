import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { http } from '~/shared/api/http';
import {
	SellerInviteDto,
	SellerInviteResult,
	SellerInviteSchema
} from './invite.contract';

export const useSellerInviteMutation = (
	onClose: VoidFunction,
	setInviteUrl: (url: string) => void
) => {
	const form = useForm<SellerInviteDto>({
		resolver: zodResolver(SellerInviteSchema)
	});

	const {
		mutateAsync,
		error: apiError,
		isPending,
		reset: apiReset
	} = useMutation({
		mutationKey: ['seller-invite'],
		mutationFn: (parsedBody: SellerInviteDto) =>
			http.post<SellerInviteResult>('sellers/invite/', parsedBody)
	});

	const onSubmit = React.useCallback(
		async (data: SellerInviteDto) => {
			toast.promise(
				(async () => {
					const response = await mutateAsync(data);
					if (response?.invite_url) {
						setInviteUrl(response.invite_url);
					}
					toast.success('Приглашение отправлено пользователю');
					form.reset();
				})(),
				{ loading: 'Отправка приглашения...' }
			);
		},
		[mutateAsync]
	);

	React.useEffect(() => {
		return () => {
			form.reset();
			apiReset();
		};
	}, [apiReset]);

	return {
		onsubmit: form.handleSubmit(onSubmit),
		apiError,
		isPending,
		form
	};
};
