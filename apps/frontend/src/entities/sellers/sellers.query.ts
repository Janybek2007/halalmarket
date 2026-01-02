import { queryOptions } from '@tanstack/react-query';
import { SellersService } from './sellers.service';
import {
	TGetOrdersParams,
	TGetReviewsParams,
	TGetSellersParams,
	TGetStoreProductsParams
} from './sellers.types';

export class SellersQuery {
	static QueryKeys = {
		GetSellersList: (params: TGetSellersParams) => ['sellers-list', params],
		GetReviews: (params: TGetReviewsParams) => ['sellers-reviews', params],
		GetStoreProducts: (params: TGetStoreProductsParams) => [
			'store-products',
			params
		],
		GetOrders: (params: TGetOrdersParams) => ['orders', params]
	};

	static GetSellersListQuery(params: TGetSellersParams) {
		return queryOptions({
			queryKey: SellersQuery.QueryKeys.GetSellersList(params),
			queryFn: () => SellersService.GetSellersList(params)
		});
	}

	static GetReviewsQuery(params: TGetReviewsParams) {
		return queryOptions({
			queryKey: SellersQuery.QueryKeys.GetReviews(params),
			queryFn: () => SellersService.GetReviews(params)
		});
	}

	// store
	static GetStoreProductsQuery(params: TGetStoreProductsParams) {
		return queryOptions({
			queryKey: SellersQuery.QueryKeys.GetStoreProducts(params),
			queryFn: () => SellersService.GetStoreProducts(params)
		});
	}

	// orders
	static GetOrdersQuery(params: TGetOrdersParams) {
		return queryOptions({
			queryKey: SellersQuery.QueryKeys.GetOrders(params),
			queryFn: () => SellersService.GetOrders(params)
		});
	}
}
