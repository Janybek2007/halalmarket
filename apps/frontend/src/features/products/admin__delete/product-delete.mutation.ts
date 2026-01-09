import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';
import { SuccessResponse } from '~/global';
import { http } from '~/shared/api/http';
import { TId } from '~/shared/api/types';
import { useConfirm } from '~/shared/libs/confirm';
import { queryClient } from '~/shared/libs/tanstack';

export const useProductDeleteMutation = () => {
	const { openConfirm } = useConfirm();

	const { mutateAsync: deleteProduct, isPending: isDeletingProduct } =
		useMutation({
			mutationKey: ['product-delete'],
			mutationFn: async (args: TId) =>
				await http.delete<SuccessResponse>(`products/${args.id}/delete/`)
		});

	const handleDeleteProduct = React.useCallback(
		(id: number) => {
			openConfirm({
				title: 'Удаление товара',
				text: 'Вы уверены, что хотите удалить товар?',
				async confirmCallback() {
					try {
						const result = await deleteProduct({ id });
						if (result?.success) {
							toast.success('Товар удален');
							await queryClient.refetchQueries({
								queryKey: ['get-products_admin']
							});
						}
					} catch (error) {
						toast.error('Ошибка удаления товара');
						throw error;
					}
				},
				confirmText: 'Удалить',
				cancelText: 'Отменить'
			});
		},
		[deleteProduct, openConfirm]
	);

	return {
		handleDeleteProduct,
		isDeletingProduct
	};
};
