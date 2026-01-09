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
			http.post<SuccessResponse>('seller/orders/ship/', body)
	});

	const handleShip = React.useCallback(
		(id: number) => {
			openConfirm({
				title: 'Отправить',
				text: 'Вы уверены что хотите отправить заказ?',
				confirmText: 'Отправить',
				cancelText: 'Отменить',
				async confirmCallback() {
					try {
						const r = await ship({ ids: [id] });
						if (r.success) {
							toast.success('Заказ отправлен');
							await queryClient.refetchQueries({
								queryKey: SellersQuery.QueryKeys.GetOrders({})
							});
						}
					} catch (error) {
						toast.error('Ошибка при отправки');
						throw error;
					}
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
