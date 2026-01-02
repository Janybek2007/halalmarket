import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';
import { SuccessResponse } from '~/global';
import { http } from '~/shared/api/http';
import { useConfirm } from '~/shared/libs/confirm';

export const usePromotionDeleteMutation = (id: number) => {
	const { mutateAsync } = useMutation({
		mutationKey: ['promotion-delete', id],
		mutationFn: () => http.delete<SuccessResponse>(`promotion/${id}/delete/`)
	});
	const { openConfirm } = useConfirm();

	const handleDelete = React.useCallback(() => {
		openConfirm({
			title: 'Удалить акцию?',
			text: 'Вы уверены, что хотите удалить акцию?',
			confirmText: 'Удалить',
			cancelText: 'Отмена',
			confirmCallback: async () => {
				toast.promise(mutateAsync(), {
					loading: 'Удаление акции...',
					success: 'Акция удалена',
					error: 'Ошибка при удалении акции'
				});
			}
		});
	}, [id, mutateAsync, openConfirm]);
	return { handleDelete };
};
