import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useCart } from '~/entities/cart';
import { http } from '~/shared/api/http';
import { useTimeDebounce } from '~/shared/hooks';

export const useProductChangeQuantityMutation = (hasToast: boolean = false) => {
	const cart = useCart();
	const { mutateAsync: changeQuantityMutation } = useMutation({
		mutationKey: ['change-guantity_cart-product'],
		mutationFn: (args: { cart_id: number; quantity: number }) =>
			http.patch(`cart/${args.cart_id}/change-quantity/`, args)
	});

	const changeQuantityDebounced = useTimeDebounce(
		async (cartId: number, quantity: number) => {
			if (!hasToast)
				return changeQuantityMutation({ cart_id: cartId, quantity });
			toast.promise(changeQuantityMutation({ cart_id: cartId, quantity }), {
				loading: 'Изменение количества...',
				success: 'Количество изменено',
				error: 'Ошибка изменения количества'
			});
		},
		500
	);

	return (quantity: number, cartId: number) => {
		changeQuantityDebounced(cartId, quantity);
		cart?.onChangeQuantity(cartId, quantity);
	};
};
