import React from 'react';

import { useCart } from '~/entities/cart';
import { Button } from '~/shared/ui/button/button.ui';
import { discountedPrice, priceFormat } from '~/shared/utils/price';
import { useCartCheckoutMutation } from '../cart-checkout.mutation';
import styles from './styles.module.scss';

export const CartSummary: React.FC = () => {
	const cart = useCart();
	const formattedTotal = React.useMemo(() => {
		if (!cart?.products || cart?.products.length === 0) return 0;
		const totalPrice = cart.products.reduce((total, item) => {
			if (!item.checked) return total;
			return (
				total +
				discountedPrice(item.product.price, item.product.discount) *
					item.quantity
			);
		}, 0);

		return new Intl.NumberFormat('ru-RU').format(totalPrice || 0);
	}, [cart?.products]);

	const items = cart?.products || [];

	const selectedItems = React.useMemo(() => {
		return items.filter(item => item.checked).map(item => item.id);
	}, [cart?.products]);

	const { handleCheckout } = useCartCheckoutMutation(selectedItems);

	return (
		<>
			<div className={styles.cartSummary}>
				<div className={styles.summaryItems}>
					{Object.entries(items.filter(v => v.checked)).map(
						([cartId, item]) => (
							<div key={cartId} className={styles.summaryItem}>
								<span
									className={styles.itemName}
									title={`${item.product.name} ${
										item.quantity > 1 ? `(${item.quantity}шт.)` : ''
									}`}
								>
									{item.product.name}{' '}
									{item.quantity > 1 ? `(${item.quantity}шт.)` : ''}
								</span>
								<span className={styles.itemPrice}>
									{priceFormat(
										discountedPrice(item.product.price, item.product.discount) *
											item.quantity,
										'сом'
									)}{' '}
								</span>
							</div>
						)
					)}
				</div>

				<div className={styles.divider}></div>

				<div className={styles.total}>
					<span className={styles.totalLabel}>Итого: </span>
					<span className={styles.totalPrice}>{formattedTotal} с</span>
				</div>

				<Button
					disabled={Object.values(items).length === 0}
					fullWidth
					className={styles.checkoutButton}
					onClick={handleCheckout}
				>
					Заказать
				</Button>
			</div>
		</>
	);
};

export default React.memo(CartSummary);
