'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Assets } from '~/shared/assets';
import { RoutePaths } from '~/shared/router';
import { Button } from '~/shared/ui/button/button.ui';
import { useAddCartProductMutation } from './cart-add.mutation';

export const AddCartProductBtn: React.FC<{
	id: number;
	cs: { btn: string; img: string };
	img?: 'primary' | 'white';
}> = React.memo(({ id, cs, img = 'white' }) => {
	const { handleAdd } = useAddCartProductMutation();
	return (
		<Button className={cs.btn} variant='outline' onClick={() => handleAdd(id)}>
			<img
				className={cs.img}
				src={img == 'primary' ? Assets.CartPrimarySvg : Assets.CartWhiteSvg}
				alt='cart'
			/>
			Добавить в корзину
		</Button>
	);
});

export const ProductBuyBtn: React.FC<{ cs: string; id: number }> = React.memo(
	({ cs, id }) => {
		const { handleAdd } = useAddCartProductMutation();
		const router = useRouter();
		const handleBuy = React.useCallback(() => {
			handleAdd(id);
			setTimeout(() => {
				router.push(RoutePaths.User.Cart);
			}, 500);
		}, [id]);

		return (
			<Button className={cs} onClick={handleBuy}>
				Купить
			</Button>
		);
	}
);

ProductBuyBtn.displayName = 'ProductBuyBtn';
AddCartProductBtn.displayName = 'AddCartProductBtn';
