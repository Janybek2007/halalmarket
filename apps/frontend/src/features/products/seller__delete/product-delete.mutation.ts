import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';
import { SellersQuery } from '~/entities/sellers';
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
			mutationFn: (args: TId) =>
				http.delete<SuccessResponse>(`store/product/${args.id}/delete/`)
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
							await queryClient.refetchQueries({
								queryKey: SellersQuery.QueryKeys.GetStoreProducts({})
							});
							toast.success('Товар удален');
						}
					} catch (error) {
						toast.error('Ошибка при удаления товара');
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
