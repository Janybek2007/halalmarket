import { ImageItem, PaginationResponse } from '~/global';
import { TPagination } from '~/shared/api/types';
import { ICategory } from '../categories';

export type TSearchProductsParams = {
	q: string;
} & TPagination;
export type TGetProductsParams = {
	category?: number | string;
} & TPagination;

export type TGetProductsListParams = {
	_to?: number | string | null;
	start_date?: string;
	end_date?: string;
} & TPagination;

export type TGetProductReviewsParams = {
	slug: string;
	_to?: string | number | null;
} & TPagination;

//
export type TModerationType = 'pending' | 'approved' | 'rejected';

export interface IProduct {
	id: number;
	name: string;
	images: ImageItem[];
	price: number;
	discount: string;
	description: string;
	is_favorite: boolean;
	store: {
		name: string;
		id: number;
		seller_name: string;
	};
	slug: string;
	subcategory: ICategory | string;
	country: string;
	moderation_type: TModerationType;
	code: string;
	composition: string;
	expiration_date: string;
	equipment: string;
	action: string;
	created_at: string;
	updated_at: string;
	average_rating: number;
	quantity: number;
}

export type IProductReview = {
	id: number;
	user: {
		id: number;
		full_name: string;
		email: string;
		avatar: string;
	};
	comment: string;
	created_at: string;
	updated_at: string;
	rating: number;
	seller_response: string;
	images: ImageItem[];
};

export interface ISearchProductItem {
	id: string;
	name: string;
	image: string;
	slug: string;
	price: string;
	discount: string;
}

export type TGetSearchProductResult = PaginationResponse<ISearchProductItem>;

export type TGetProductsWithCategoriesResult = (Omit<
	ICategory,
	'childs' | 'parent'
> & {
	products: IProduct[];
})[];

export type TGetProductsResult = PaginationResponse<IProduct> & {
	category: ICategory;
};

export type TGetProductsListResult = PaginationResponse<IProduct> & {
	category: ICategory;
};
export type TProductReviewResult = PaginationResponse<IProductReview>;
