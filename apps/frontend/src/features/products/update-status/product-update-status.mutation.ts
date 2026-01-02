import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';
import { SuccessResponse } from '~/global';
import { http } from '~/shared/api/http';
import { queryClient } from '~/shared/libs/tanstack';

export const useProductUpdateStatusMutation = () => {
	const { mutateAsync: updateProductStatus, isPending: isUpdatingStatus } =
		useMutation({
			mutationKey: ['product-update-status'],
			mutationFn: async (args: {
				id: number;
				status: 'approved' | 'rejected';
			}) =>
				http.patch<SuccessResponse>(`products/${args.id}/moderate/`, {
					status: args.status
				})
		});

	const handleUpdateProductStatus = React.useCallback(
		(id: number, status: 'approved' | 'rejected') => {
			toast.promise(
				async () => {
					const result = await updateProductStatus({ id, status });
					if (result?.success) {
						queryClient.refetchQueries({
							queryKey: ['get-products_admin']
						});
						return result;
					}
					throw new Error('Failed to update product status');
				},
				{
					loading: 'Обновление статуса...',
					success: `Статус товара обновлен`,
					error: 'Ошибка при обновлении статуса'
				}
			);
		},
		[updateProductStatus]
	);

	return {
		handleUpdateProductStatus,
		isUpdatingStatus
	};
};
