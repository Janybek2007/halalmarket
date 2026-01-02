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
				confirmCallback: () => {
					toast.promise(
						async () => {
							const result = await deleteProduct({ id });
							if (result.success) {
								queryClient.refetchQueries({
									queryKey: SellersQuery.QueryKeys.GetStoreProducts({})
								});
							}
						},
						{
							loading: 'Удаление товара...',
							success: 'Товар удален',
							error: 'Ошибка удаления товара'
						}
					);
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
