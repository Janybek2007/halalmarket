import React from 'react';
import { Styles } from '~/global';
import { useProductChangeQuantityMutation } from './change-quantity.mutation';

export const ProductQuantityControls: React.FC<{
	cartId: number;
	quantity: number;
	styles: Styles;
}> = React.memo(({ cartId, quantity, styles }) => {
	const onChangeQuantity = useProductChangeQuantityMutation();

	return (
		<div className={styles.controls}>
			<button
				className={styles.controlButton}
				onClick={() => onChangeQuantity(quantity - 1, cartId)}
				disabled={quantity <= 1}
			>
				-
			</button>
			<span className={styles.quantity}>{quantity}</span>
			<button
				className={styles.controlButton}
				onClick={() => onChangeQuantity(quantity + 1, cartId)}
			>
				+
			</button>
		</div>
	);
});

ProductQuantityControls.displayName = 'ProductQuantityControls';
