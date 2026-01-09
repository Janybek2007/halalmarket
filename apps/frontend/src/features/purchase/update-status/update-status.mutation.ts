import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';
import { PurchasesQuery } from '~/entities/purchase';
import { SuccessResponse } from '~/global';
import { http } from '~/shared/api/http';
import { TIds } from '~/shared/api/types';
import { useConfirm } from '~/shared/libs/confirm';
import { queryClient } from '~/shared/libs/tanstack';

export const usePurchaseUpdateStatusMutation = () => {
	const { mutateAsync: updatePurchaseStatus } = useMutation({
		mutationKey: ['purchase_update-status'],
		mutationFn: (body: { status: 'delivered' | 'cancelled' } & TIds) => {
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
				cancelText: 'Отмена',
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
				title: 'Подтвердить получение заказа',
				text: 'Вы уверены, что хотите подтвердить получение заказа?',
				confirmText: 'Подтвердить',
				cancelText: 'Отмена',
				async confirmCallback() {
					try {
						const result = await updatePurchaseStatus({
							ids: [id],
							status: 'delivered'
						});
						if (result?.success) {
							toast.success('Заказ успешно подтвержден');
						}
					} catch (error) {
						toast.error('Ошибка при подтверждении заказа');
						throw error;
					}
				}
			});
		},
		[updatePurchaseStatus, openConfirm]
	);

	return {
		handleCancelPurchase,
		handleDeliveredPurchase
	};
};
