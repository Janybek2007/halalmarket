import { http } from '~/shared/api/http';
import {
	ISellerBalance,
	TGetOrdersParams,
	TGetOrdersResult,
	TGetReviewsParams,
	TGetReviewsResult,
	TGetSellersParams,
	TGetSellerWithdrawals,
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

	static GetSellerBalance() {
		return http.get<ISellerBalance>('seller/balance/');
	}

	static GetSellerWithdrawals() {
		return http.get<TGetSellerWithdrawals>('seller/withdrawals/');
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
