'use client';
import { createContext, useContext } from 'react';
import { CartContextValue } from '../cart.types';

export const CartContext = createContext<CartContextValue | null>(null);

export const useCart = (_throw: boolean = true) => {
	const context = useContext(CartContext);

	if (!context && _throw) {
		throw new Error('useCart must be used within a CartProvider');
	}

	return context;
};
