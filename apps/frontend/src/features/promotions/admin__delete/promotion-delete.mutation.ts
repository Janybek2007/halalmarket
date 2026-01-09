import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';
import { PromotionsQuery } from '~/entities/promotion';
import { SuccessResponse } from '~/global';
import { http } from '~/shared/api/http';
import { useConfirm } from '~/shared/libs/confirm';
import { queryClient } from '~/shared/libs/tanstack';

export const usePromotionDeleteMutation = (promotionId: number) => {
	const { openConfirm } = useConfirm();
	const mutation = useMutation({
		mutationKey: ['promotion-delete', promotionId],
		mutationFn: () =>
			http.delete<SuccessResponse>(`promotion/${promotionId}/delete/`)
	});

	const handleDelete = React.useCallback(() => {
		openConfirm({
			title: 'Удалить акцию?',
			text: 'Вы действительно хотите удалить эту акцию? Это действие нельзя отменить.',
			confirmText: 'Удалить',
			cancelText: 'Отмена',
			async confirmCallback() {
				try {
					const result = await mutation.mutateAsync();
					if (result?.success) {
						await queryClient.refetchQueries({
							queryKey: PromotionsQuery.QueryKeys.GetPromotions({})
						});
						toast.success('Акция успешно удалена');
					}
				} catch (error) {
					toast.error('Ошибка при удалении акции');
					throw error;
				}
			}
		});
	}, [openConfirm, mutation.mutateAsync]);

	return {
		handleDelete
	};
};
