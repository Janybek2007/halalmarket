import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';
import { SellersQuery } from '~/entities/sellers';
import { SuccessResponse } from '~/global';
import { http } from '~/shared/api/http';
import { TIds } from '~/shared/api/types';
import { useConfirm } from '~/shared/libs/confirm';
import { queryClient } from '~/shared/libs/tanstack';
import { getSplitedErrors } from '~/shared/utils/get-splited-errors';

export const useOrderUpdateStatusMutation = () => {
	const { openConfirm } = useConfirm();
	const { mutateAsync: ship, error } = useMutation({
		mutationKey: ['order_update-status'],
		mutationFn: (body: TIds) =>
			http.post<SuccessResponse>('seller/orders/ship/', body),
		onSuccess() {
			queryClient.refetchQueries({
				queryKey: SellersQuery.QueryKeys.GetOrders({})
			});
		}
	});

	const handleShip = React.useCallback(
		(id: number) => {
			openConfirm({
				title: 'Отправить',
				text: 'Вы уверены что хотите отправить заказ?',
				confirmText: 'Отправить',
				cancelText: 'Отменить',
				confirmCallback: () => {
					toast.promise(ship({ ids: [id] }), {
						loading: 'Отправка...',
						success: 'Заказ отправлен',
						error: 'Ошибка отправки'
					});
				}
			});
		},
		[openConfirm, ship]
	);

	React.useEffect(() => {
		if (!error) return;
		const errors = getSplitedErrors(error as any);
		errors?.forEach(error => toast.error(error));
		return () => {
			toast.dismiss();
		};
	}, [error]);
	return {
		handleShip
	};
};
