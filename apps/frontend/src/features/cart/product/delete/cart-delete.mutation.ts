import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';
import { useCart } from '~/entities/cart/context/cart.context';
import { SuccessResponse } from '~/global';
import { http } from '~/shared/api/http';

export const useCartProductDeleteMutation = (
	cartId: number,
	onClose: VoidFunction
) => {
	const cart = useCart();
	const { mutateAsync: removeProductMutation } = useMutation({
		mutationKey: ['cart-product-delete', cartId],
		mutationFn: () => {
			return http.delete<SuccessResponse>(`cart/${cartId}/`);
		}
	});

	const handleRemove = React.useCallback(() => {
		toast.promise(
			async () => {
				const r = await removeProductMutation();
				if (r.success) {
					onClose();
					cart?.removeProduct(cartId);
				}
			},
			{
				loading: 'Удаление товара...',
				success: 'Товар удален',
				error: 'Ошибка удаления товара'
			}
		);
	}, [removeProductMutation]);

	return { handleRemove };
};
