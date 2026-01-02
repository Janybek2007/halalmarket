import { createContext, useContext } from 'react';
import { FavoritesContextValue } from '../favorites.types';

export const FavoritesContext = createContext<FavoritesContextValue | null>(
	null
);

export const useFavorites = () => {
	const context = useContext(FavoritesContext);
	if (!context) {
		throw new Error('useFavorites must be used within a FavoritesProvider');
	}
	return context;
};
