import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';
import { PromotionsQuery } from '~/entities/promotion';
import { SuccessResponse } from '~/global';
import { http } from '~/shared/api/http';
import { useConfirm } from '~/shared/libs/confirm';
import { queryClient } from '~/shared/libs/tanstack';

export const usePromotionUpdateStatusMutation = (promotionId: number) => {
	const { openConfirm } = useConfirm();
	const mutation = useMutation({
		mutationKey: ['promotion-update-status', promotionId],
		mutationFn: (parsedBody: { status: 'approve' | 'reject' }) =>
			http.post<SuccessResponse>(`promotions/update-status/`, {
				action: parsedBody.status,
				ids: [promotionId]
			})
	});
	const handleApprove = React.useCallback(() => {
		openConfirm({
			title: 'Подтвердить акцию?',
			text: 'Вы действительно хотите активировать эту акцию?',
			confirmText: 'Активировать',
			cancelText: 'Отмена',
			async confirmCallback() {
				try {
					const result = await mutation.mutateAsync({ status: 'approve' });
					if (result.success) {
						await queryClient.refetchQueries({
							queryKey: PromotionsQuery.QueryKeys.GetPromotions({})
						});
						toast.success('Акция успешно активирована');
					}
				} catch (error) {
					toast.error('Ошибка при активации акции');
					throw error;
				}
			}
		});
	}, [openConfirm]);

	const handleReject = React.useCallback(() => {
		openConfirm({
			title: 'Отклонить акцию?',
			text: 'Вы действительно хотите отклонить эту акцию?',
			confirmText: 'Отклонить',
			cancelText: 'Отмена',
			async confirmCallback() {
				try {
					const result = await mutation.mutateAsync({ status: 'reject' });
					if (result.success) {
						await queryClient.refetchQueries({
							queryKey: PromotionsQuery.QueryKeys.GetPromotions({})
						});
						toast.success('Акция успешно отклонена');
					}
				} catch (error) {
					toast.error('Ошибка при отклонении акции');
					throw error;
				}
			}
		});
	}, [openConfirm]);

	return {
		handleApprove,
		handleReject
	};
};
