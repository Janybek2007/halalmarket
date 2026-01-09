import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';
import { SuccessResponse } from '~/global';
import { http } from '~/shared/api/http';
import { useConfirm } from '~/shared/libs/confirm';
import { queryClient } from '~/shared/libs/tanstack';
import { RoutePaths } from '~/shared/router';

export const useCartCheckoutMutation = (selectedItems: number[]) => {
	const { openConfirm } = useConfirm();
	const router = useRouter();

	const { mutateAsync } = useMutation({
		mutationKey: [],
		mutationFn: (args: { ids: number[] }) =>
			http.post<SuccessResponse & { order_group_id: number }>('purchase/', {
				cart_ids: args.ids
			})
	});

	const handleCheckout = React.useCallback(() => {
		openConfirm({
			title: 'Подтверждение',
			text: 'Вы уверены, что хотите оформить заказ?',
			confirmText: 'Оформить',
			cancelText: 'Отменить',
			async confirmCallback() {
				try {
					const r = await mutateAsync({ ids: selectedItems });
					if (r.success) {
						toast.success('Заказ оформлен');
						await queryClient.refetchQueries({ queryKey: ['cart-list'] });
						router.push(RoutePaths.User.Orders);
					}
				} catch (error) {
					toast.error('Ошибка оформления заказа');
					throw error;
				}
			}
		});
	}, [openConfirm, mutateAsync, selectedItems]);

	return {
		handleCheckout
	};
};
