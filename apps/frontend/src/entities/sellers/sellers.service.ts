import { http } from '~/shared/api/http';
import {
	TGetOrdersParams,
	TGetOrdersResult,
	TGetReviewsParams,
	TGetReviewsResult,
	TGetSellersParams,
	TGetStoreProductsParams,
	TGetStoreProductsResult,
	TSellerGetResult
} from './sellers.types';

export class SellersService {
	static GetSellersList(params: TGetSellersParams) {
		return http.get<TSellerGetResult>('sellers-list/', {
			query: params
		});
	}

	static GetReviews(params: TGetReviewsParams) {
		return http.get<TGetReviewsResult>('seller/reviews/', {
			query: params
		});
	}

	static GetStoreProducts(params: TGetStoreProductsParams) {
		return http.get<TGetStoreProductsResult>('store/products/', {
			query: params
		});
	}

	static GetOrders(params: TGetOrdersParams) {
		return http.get<TGetOrdersResult>('seller/orders/', {
			query: params
		});
	}
}
