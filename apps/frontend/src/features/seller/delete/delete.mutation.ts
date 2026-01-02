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
			confirmCallback: () => {
				toast.promise(
					async () => {
						const r = await deleteSeller({ ids: ids.map(v => +v) });
						if (r?.success) {
							toast.success(`Продавец удален`);
							callback();
						}
					},
					{
						loading: 'Удаление продавца',
						error: 'Ошибка при удалении продавца'
					}
				);
			}
		});
	}, [deleteSeller, openConfirm, callback, ids]);
	return { handleDeleteSellers };
};
