'use client';
import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';
import { RoutePaths } from '~/shared/router';
import { CartService } from '../cart.service';
import { CartContextValue, ICartStore } from '../cart.types';
import { CartContext } from './cart.context';

export const CartProvider: React.FC<{
	children: React.ReactNode | ((context: CartContextValue) => React.ReactNode);
}> = ({ children }) => {
	const pathname = usePathname();
	const {
		data: carts,
		isLoading,
		refetch
	} = useQuery({
		queryKey: ['cart-list'],
		queryFn: () => CartService.GetCart()
	});

	const [products, setProducts] = useState<CartContextValue['products']>([]);
	const [store, setStore] = useState<ICartStore>({
		isEmpty: false,
		totalCount: 0
	});

	const removeProduct = useCallback((cartId: number) => {
		setProducts(prev => {
			let r = prev.filter(p => p.id !== cartId);
			if (r.length == 0) {
				setStore(p => ({ ...p, totalCount: 0, isEmpty: true }));
			}

			return r;
		});
	}, []);

	const getCartItemQuantity = useCallback(
		(cartId: number) => {
			const product = products?.find(item => item.id === cartId);
			return product?.quantity || 0;
		},
		[products]
	);

	const onCheckProduct = useCallback(
		(cartId?: number, action?: 'check' | 'uncheck') => {
			setProducts(prev => {
				if (!cartId) {
					return prev.map(item => ({
						...item,
						checked: action === 'check'
					}));
				}
				return prev.map(item => {
					if (item.id === cartId) {
						return { ...item, checked: !item.checked };
					}
					return item;
				});
			});
		},
		[]
	);

	const onChangeQuantity = useCallback((cartId: number, quantity = 1) => {
		setProducts(prev => {
			return prev.map(item => {
				if (item.id === cartId) {
					if (item.quantity === 1 && quantity < 1) return item;
					return { ...item, quantity };
				}
				return item;
			});
		});
	}, []);

	const changeTotals = useCallback(
		(productId: number) => {
			setStore(prev => {
				const exists = products.some(p => p.id === productId);

				if (exists) return prev;

				const newTotalCount = prev.totalCount + 1;

				return {
					...prev,
					totalCount: newTotalCount,
					isEmpty: newTotalCount === 0
				};
			});
		},
		[products]
	);

	useEffect(() => {
		if (pathname !== RoutePaths.User.Cart) return;
		if (store.totalCount > products.length) {
			refetch();
		}
	}, [pathname]);

	useEffect(() => {
		if (!carts) return;
		let _products: CartContextValue['products'] = carts.map(cart => ({
			...cart,
			checked: true
		}));

		setStore({
			isEmpty: !_products || _products.length === 0,
			totalCount: _products?.length || 0
		});
		setProducts(_products);
	}, [carts]);

	const contextValue: CartContextValue = {
		...store,
		isLoading,
		products,
		getCartItemQuantity,
		onCheckProduct,
		onChangeQuantity,
		removeProduct,
		changeTotals
	};

	return (
		<CartContext.Provider value={contextValue}>
			{typeof children === 'function' ? children(contextValue) : children}
		</CartContext.Provider>
	);
};
