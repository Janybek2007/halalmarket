import { http } from '~/shared/api/http';
import {
	IProduct,
	TGetProductReviewsParams,
	TGetProductsListParams,
	TGetProductsListResult,
	TGetProductsParams,
	TGetProductsResult,
	TGetProductsWithCategoriesResult,
	TGetSearchProductResult,
	TProductReviewResult,
	TSearchProductsParams
} from './products.types';

export class ProductService {
	static GetProductList(params: TGetProductsListParams) {
		return http.get<TGetProductsListResult>('products-list/', {
			query: params
		});
	}

	static GetProducts(params: TGetProductsParams) {
		return http.get<TGetProductsResult>('products/', {
			query: params
		});
	}

	static GetProduct(slug: string) {
		return http.get<IProduct>(`product/${slug}/`);
	}

	static GetProductReviews(params: TGetProductReviewsParams) {
		return http.get<TProductReviewResult>(`product/${params.slug}/reviews/`, {
			query: params
		});
	}

	static GetSearchProduct(params: TSearchProductsParams) {
		return http.get<TGetSearchProductResult>('products/search/', {
			query: params
		});
	}

	static GetProductsWithCategories(
		params: TGetProductsParams & {revalidate?: number},
		token: string | null = ''
	) {
		return http.get<TGetProductsWithCategoriesResult>('products/', {
			query: {
				...params,
				with_category: 'true'
			},
			headers: {
				Authorization: `Bearer ${token}`
			},
			revalidate: params.revalidate
		});
	}
}
