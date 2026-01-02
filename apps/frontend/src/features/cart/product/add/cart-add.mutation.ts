import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useSession } from '~/app/providers/session';
import { useCart } from '~/entities/cart';
import { SuccessResponse } from '~/global';
import { http } from '~/shared/api/http';
import { useTimeDebounce } from '~/shared/hooks';
import { unauthorizedToast } from '~/shared/utils/unauthorized-toast';

export const useAddCartProductMutation = () => {
	const { user: profile } = useSession();
	const cart = useCart(false);
	const { mutateAsync: addProductMutation } = useMutation({
		mutationKey: ['cart-add_product'],
		mutationFn: (args: { product_id: number; quantity: string }) =>
			http.post<SuccessResponse>('cart/add/', args)
	});

	const handleAdd = useTimeDebounce(async (productId: number, quantity = 1) => {
		if (!profile) {
			unauthorizedToast();
			return;
		}
		toast.promise(
			async () => {
				const r = await addProductMutation({ product_id: productId, quantity });
				if (r.success) {
					cart?.changeTotals(productId);
				}
			},
			{
				loading: 'Добавление товара в корзину...',
				success: 'Товар добавлен в корзину',
				error: 'Ошибка добавления товара'
			}
		);
	}, 500);

	return { handleAdd };
};
