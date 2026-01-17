import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';
import { PurchasesQuery } from '~/entities/purchase';
import { SuccessResponse } from '~/global';
import { http } from '~/shared/api/http';
import { TIds } from '~/shared/api/types';
import { useConfirm } from '~/shared/libs/confirm';
import { queryClient } from '~/shared/libs/tanstack';

type TUpdateStatusBody = {
	status: 'delivered' | 'cancelled' | 'cancellation_requested';
} & TIds;

export const usePurchaseUpdateStatusMutation = () => {
	const { mutateAsync: updatePurchaseStatus } = useMutation({
		mutationKey: ['purchase_update-status'],
		mutationFn: (body: TUpdateStatusBody) => {
			return http.post<SuccessResponse>('purchases/update-status/', body);
		},
		onSuccess() {
			queryClient.refetchQueries({
				queryKey: PurchasesQuery.QueryKeys.GetPurchases({})
			});
		}
	});
	const { openConfirm } = useConfirm();

	const handleCancelPurchase = React.useCallback(
		(id: number) => {
			openConfirm({
				title: 'Отменить заказ',
				text: 'Вы уверены, что хотите отменить заказ?',
				confirmText: 'Отменить',
				cancelText: 'Назад',
				async confirmCallback() {
					try {
						const result = await updatePurchaseStatus({
							ids: [id],
							status: 'cancelled'
						});
						if (result?.success) {
							toast.success('Заказ успешно отменен');
						}
					} catch (error) {
						toast.error('Ошибка при отмене заказа');
						throw error;
					}
				}
			});
		},
		[updatePurchaseStatus, openConfirm]
	);

	const handleDeliveredPurchase = React.useCallback(
		(id: number) => {
			openConfirm({
				title: 'Подтвердить получение',
				text: 'Вы уверены, что получили заказ?',
				confirmText: 'Подтвердить',
				cancelText: 'Назад',
				async confirmCallback() {
					try {
						const result = await updatePurchaseStatus({
							ids: [id],
							status: 'delivered'
						});
						if (result?.success) {
							toast.success('Получение подтверждено');
						}
					} catch (error) {
						toast.error('Ошибка при подтверждении');
						throw error;
					}
				}
			});
		},
		[updatePurchaseStatus, openConfirm]
	);

	const handleRequestReturn = React.useCallback(
		(id: number) => {
			openConfirm({
				title: 'Запросить возврат',
				text: 'Вы уверены, что хотите запросить возврат? Вам нужно будет вернуть товар продавцу.',
				confirmText: 'Запросить',
				cancelText: 'Назад',
				async confirmCallback() {
					try {
						const result = await updatePurchaseStatus({
							ids: [id],
							status: 'cancellation_requested'
						});
						if (result?.success) {
							toast.success('Запрос на возврат отправлен');
						}
					} catch (error) {
						toast.error('Ошибка при запросе возврата');
						throw error;
					}
				}
			});
		},
		[updatePurchaseStatus, openConfirm]
	);

	return {
		handleCancelPurchase,
		handleDeliveredPurchase,
		handleRequestReturn
	};
};
