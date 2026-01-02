import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { http } from '~/shared/api/http';
import { useConfirm } from '~/shared/libs/confirm';

export const usePromotionDeleteMutation = (promotionId: number) => {
	const { openConfirm } = useConfirm();
	const mutation = useMutation({
		mutationKey: ['promotion-delete', promotionId],
		mutationFn: () => http.delete(`promotion/${promotionId}/delete/`)
	});

	const handleDelete = React.useCallback(() => {
		openConfirm({
			title: 'Удалить акцию?',
			text: 'Вы действительно хотите удалить эту акцию? Это действие нельзя отменить.',
			confirmText: 'Удалить',
			cancelText: 'Отмена',
			confirmCallback: async () => {
				const { toast } = await import('sonner');
				toast.promise(mutation.mutateAsync(), {
					loading: 'Удаление акции...',
					success: 'Акция успешно удалена',
					error: 'Ошибка при удалении акции'
				});
			}
		});
	}, [openConfirm]);

	return {
		handleDelete
	};
};
