import { PaginationResponse } from '~/global';
import { UsePaginationReturn } from '~/shared/libs/pagination/use-pagination';

export interface IFavoriteItem {
	id: number;
	product: {
		id: number;
		name: string;
		slug: string;
		price: number;
		discount: number;
		image: string;
	};
	created_at: string;
}

export type TGetFavoritesResult = PaginationResponse<IFavoriteItem>;

export interface FavoritesContextValue {
	favorites: TGetFavoritesResult | undefined;
	isLoading: boolean;
	pagination: UsePaginationReturn;
}
