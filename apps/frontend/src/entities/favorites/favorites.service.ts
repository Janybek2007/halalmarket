import { http } from '~/shared/api/http';
import { TPagination } from '~/shared/api/types';
import { TGetFavoritesResult } from './favorites.types';

export class FavoritesService {
	static GetFavorites(params: TPagination) {
		return http.get<TGetFavoritesResult>('favorites/', {
			query: params
		});
	}
}
