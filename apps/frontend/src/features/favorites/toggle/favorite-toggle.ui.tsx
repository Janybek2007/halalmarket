import React from 'react';
import { Styles } from '~/global';
import { Icon } from '~/shared/ui/icon/icon.ui';
import { useFavoriteToggleMutation } from './favorite-toggle.mutation';

export const FavoriteToggleBtn: React.FC<{
	s: Styles;
	productId: number;
	default?: boolean;
}> = React.memo(({ s, productId, default: _d = false }) => {
	const { isFavorite, isPending, toggleFavorite } =
		useFavoriteToggleMutation(_d);
	return (
		<button
			className={`${s.favoriteButton} ${true ? s.active : ''}`}
			aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
			onClick={() => toggleFavorite(productId)}
			disabled={isPending}
		>
			<Icon
				name={
					isFavorite
						? 'material-symbols-light:favorite'
						: 'material-symbols-light:favorite-outline'
				}
			/>
		</button>
	);
});

export const FavoriteToggleOptionBtn: React.FC<{
	className: string;
	productId: number;
	default?: boolean;
}> = React.memo(({ className, productId, default: _d = false }) => {
	const { toggleFavorite } = useFavoriteToggleMutation(_d);
	return (
		<button
			data-option
			className={className}
			onClick={() => toggleFavorite(productId)}
		>
			<Icon c_size={18} name='icon-park-outline:delete' />
			<span data-danger data-center>
				Удалить
			</span>
		</button>
	);
});
