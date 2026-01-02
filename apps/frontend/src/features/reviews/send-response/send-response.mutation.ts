import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';
import { SellersQuery, TGetReviewsResult } from '~/entities/sellers';
import { SuccessResponse } from '~/global';
import { http } from '~/shared/api/http';
import { queryClient } from '~/shared/libs/tanstack';

export const useSendResponseMutation = (
	onClose: VoidFunction,
	reviewId: number
) => {
	const [response, setResponse] = React.useState('');
	const { mutateAsync, isPending } = useMutation({
		mutationKey: ['send-respons_review', reviewId],
		mutationFn: (args: { response: string }) =>
			http.post<SuccessResponse>(`seller/reviews/${reviewId}/respond/`, args)
	});

	const onSubmit = React.useCallback(
		(e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			toast.promise(
				async () => {
					const r = await mutateAsync({ response });
					if (r.success) {
						queryClient.setQueryData<TGetReviewsResult>(
							SellersQuery.QueryKeys.GetReviews({}),
							prev => {
								return {
									...prev,
									results: (prev?.results || []).map(v =>
										v.id === reviewId ? { ...v, seller_response: response } : v
									)
								} as TGetReviewsResult;
							}
						);

						toast.success('Ответ отправлен');
						setTimeout(onClose, 500);
					}
				},
				{ loading: 'Отправка...', error: 'Ошибка при отправке' }
			);
		},
		[mutateAsync, reviewId, response, onClose]
	);

	return {
		onSubmit,
		response,
		setResponse,
		isPending
	};
};
