import { useMutation } from '@tanstack/react-query';
import * as React from 'react';
import { toast } from 'sonner';
import { useSession } from '~/app/providers/session';
import { TGetFavoritesResult } from '~/entities/favorites';
import { SuccessResponse } from '~/global';
import { http } from '~/shared/api/http';
import { TId } from '~/shared/api/types';
import { queryClient } from '~/shared/libs/tanstack';
import { unauthorizedToast } from '~/shared/utils/unauthorized-toast';

const actionData = {
	added: {
		loading: 'Добавление в избранное...',
		success: 'Товар добавлен в избранное',
		error: 'Ошибка добавления в избранное'
	},
	removed: {
		loading: 'Удаление из избранного...',
		success: 'Товар удален из избранного',
		error: 'Ошибка удаления из избранного'
	}
};

export const useFavoriteToggleMutation = (isFavorite = false) => {
	const [isf, setIsf] = React.useState(isFavorite);

	const { mutateAsync, isPending } = useMutation({
		mutationKey: ['favorite-toggle'],
		mutationFn: (args: TId) =>
			http.post<SuccessResponse & { action: 'added' | 'removed' }>(
				'favorites/toggle/',
				{ product_id: args.id }
			)
	});
	const { user: profile } = useSession();

	const toggleFavorite = React.useCallback(
		(id: number) => {
			if (!profile) {
				unauthorizedToast();
				return;
			}
			toast.promise(
				async () => {
					const r = await mutateAsync({ id });
					if (r.success) {
						setIsf(r.action == 'added');
						queryClient.setQueryData<TGetFavoritesResult>(
							['get-favorites'],
							prev => {
								let filtered = prev?.results || [];
								if (r.action == 'removed') {
									filtered = filtered.filter(fp => fp.product.id !== id);
								}

								return {
									...prev,
									count:
										r.action == 'removed'
											? filtered.length
											: filtered.length + 1,
									results: filtered
								} as TGetFavoritesResult;
							}
						);
					}
				},
				{
					loading: actionData[isFavorite ? 'removed' : 'added'].loading,
					success: actionData[isFavorite ? 'removed' : 'added'].success,
					error: actionData[isFavorite ? 'removed' : 'added'].error
				}
			);
		},
		[isFavorite, mutateAsync, profile]
	);

	return {
		toggleFavorite,
		isPending,
		isFavorite: isf
	};
};
