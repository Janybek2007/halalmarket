import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';
import { SuccessResponse } from '~/global';
import { http } from '~/shared/api/http';
import { TIds } from '~/shared/api/types';
import { useConfirm } from '~/shared/libs/confirm';

export const useSellersDeleteMutation = (
	ids: string[],
	callback: VoidFunction
) => {
	const { openConfirm } = useConfirm();

	const { mutateAsync: deleteSeller } = useMutation({
		mutationKey: ['sellers-delete', ids],
		mutationFn: (body: TIds) =>
			http.delete<SuccessResponse>('sellers/delete/', {
				body: { ids: body.ids.join(',') }
			})
	});

	const handleDeleteSellers = React.useCallback(async () => {
		openConfirm({
			title: 'Удаление продавца',
			text: 'Вы уверены, что хотите удалить продавца?',
			confirmText: 'Удалить',
			cancelText: 'Отменить',
			async confirmCallback() {
				try {
					const result = await deleteSeller({ ids: ids.map(v => +v) });
					if (result?.success) {
						toast.success('Продавец удален');
						callback();
					}
				} catch (error) {
					toast.error('Ошибка при удалении продавца');
					throw error;
				}
			}
		});
	}, [deleteSeller, openConfirm, callback, ids]);
	return { handleDeleteSellers };
};
