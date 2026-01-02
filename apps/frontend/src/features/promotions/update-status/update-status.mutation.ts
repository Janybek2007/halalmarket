import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';
import { http } from '~/shared/api/http';
import { useConfirm } from '~/shared/libs/confirm';

export const usePromotionUpdateStatusMutation = (promotionId: number) => {
	const { openConfirm } = useConfirm();
	const mutation = useMutation({
		mutationKey: ['promotion-update-status', promotionId],
		mutationFn: (parsedBody: { status: 'approve' | 'reject' }) =>
			http.post(`promotions/update-status/`, {
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
			confirmCallback: async () => {
				toast.promise(mutation.mutateAsync({ status: 'approve' }), {
					loading: 'Активация акции...',
					success: 'Акция успешно активирована',
					error: 'Ошибка при активации акции'
				});
			}
		});
	}, [openConfirm]);

	const handleReject = React.useCallback(() => {
		openConfirm({
			title: 'Отклонить акцию?',
			text: 'Вы действительно хотите отклонить эту акцию?',
			confirmText: 'Отклонить',
			cancelText: 'Отмена',
			confirmCallback: async () => {
				toast.promise(mutation.mutateAsync({ status: 'reject' }), {
					loading: 'Отклонение акции...',
					success: 'Акция успешно отклонена',
					error: 'Ошибка при отклонении акции'
				});
			}
		});
	}, [openConfirm]);

	return {
		handleApprove,
		handleReject
	};
};
