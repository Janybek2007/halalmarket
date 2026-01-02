import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { PurchasesQuery } from '~/entities/purchase';
import { http } from '~/shared/api/http';
import { TIds } from '~/shared/api/types';
import { useConfirm } from '~/shared/libs/confirm';
import { queryClient } from '~/shared/libs/tanstack';

export const usePurchaseUpdateStatusMutation = () => {
	const { mutateAsync: cancelPurchase } = useMutation({
		mutationKey: ['purchase_update-status'],
		mutationFn: (body: { status: 'delivered' | 'cancelled' } & TIds) => {
			return http.post('purchases/update-status/', body);
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
				confirmCallback: () => {
					cancelPurchase({ ids: [id], status: 'cancelled' });
				}
			});
		},
		[cancelPurchase, openConfirm]
	);

	const handleDeliveredPurchase = React.useCallback(
		(id: number) => {
			openConfirm({
				title: 'Подтвердить получение заказа',
				text: 'Вы уверены, что хотите подтвердить получение заказа?',
				confirmText: 'Подтвердить',
				cancelText: 'Отмена',
				confirmCallback: () => {
					cancelPurchase({ ids: [id], status: 'delivered' });
				}
			});
		},
		[cancelPurchase, openConfirm]
	);

	return {
		handleCancelPurchase,
		handleDeliveredPurchase
	};
};
