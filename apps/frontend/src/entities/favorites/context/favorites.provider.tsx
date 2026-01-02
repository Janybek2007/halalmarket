import { queryOptions } from '@tanstack/react-query';
import React from 'react';
import { TPagination } from '~/shared/api/types';
import { usePaginatedQuery } from '~/shared/libs/pagination';
import { FavoritesService } from '../favorites.service';
import { FavoritesContextValue } from '../favorites.types';
import { FavoritesContext } from './favorites.context';

const ITEMS_PER_PAGE = 3;

export const FavoritesProvider: React.FC<React.PropsWithChildren> = ({
	children
}) => {
	const {
		query: { isLoading, refetch },
		data,
		pagination
	} = usePaginatedQuery(
		(params: TPagination) =>
			queryOptions({
				queryKey: ['get-favorites', params],
				queryFn: () => FavoritesService.GetFavorites(params)
			}),
		{ per_pages: ITEMS_PER_PAGE }
	);

	const hasRefetched = React.useRef(false);

	React.useEffect(() => {
		if (!hasRefetched.current && data?.count !== data?.results.length) {
			refetch();
			hasRefetched.current = true;
		}
	}, [data, refetch]);

	const values: FavoritesContextValue = {
		favorites: data,
		isLoading,
		pagination
	};

	return (
		<FavoritesContext.Provider value={values}>
			{children}
		</FavoritesContext.Provider>
	);
};
