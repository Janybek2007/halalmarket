import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';
import { SellersQuery } from '~/entities/sellers';
import { SuccessResponse } from '~/global';
import { http } from '~/shared/api/http';
import { useConfirm } from '~/shared/libs/confirm';
import { queryClient } from '~/shared/libs/tanstack';

export const useReviewDeleteMutation = () => {
	const { openConfirm } = useConfirm();

	const { mutateAsync: reviewDelete, isPending: isDeletingReview } =
		useMutation({
			mutationKey: ['review-delete_seller'],
			mutationFn: ({ reviewId }: { reviewId: number }) =>
				http.delete<SuccessResponse>(`seller/reviews/${reviewId}/delete/`)
		});

	const handleRemove = React.useCallback(
		(reviewId: number) => {
			openConfirm({
				title: 'Удаление отзыва',
				text: 'Вы уверены, что хотите удалить этот отзыв?',
				confirmText: 'Удалить',
				cancelText: 'Отменить',
				confirmCallback: () => {
					toast.promise(
						async () => {
							const result = await reviewDelete({ reviewId });
							if (result.success) {
								queryClient.refetchQueries({
									queryKey: SellersQuery.QueryKeys.GetReviews({})
								});
							}
						},
						{
							loading: 'Удаление отзыва...',
							success: 'Отзыв успешно удалён',
							error: 'Ошибка при удалении отзыва'
						}
					);
				}
			});
		},
		[openConfirm, reviewDelete]
	);

	return {
		handleRemove,
		isDeletingReview
	};
};
