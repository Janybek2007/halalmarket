import { PaginationResponse } from '~/global';
import { TPagination } from '~/shared/api/types';
import { IProduct, IProductReview } from '../products';
import { IPurchaseResult } from '../purchase';
import { IUser } from '../user';

export type TGetSellersParams = {
	_to?: number | string | null;
	search?: string;
	status?: string;
} & TPagination;

export type TGetReviewsParams = {
	_to?: number | string | null;
} & TPagination;

export type TGetStoreProductsParams = TGetReviewsParams;

export type TGetOrdersParams = {
	_to?: string | null | undefined;
	start_date?: string | null | undefined;
	end_date?: string | null | undefined;
} & TPagination;

export type TSellerStatus = 'active' | 'blocked';

//

export interface ISeller {
	id: string;
	user: Pick<IUser, 'full_name' | 'phone' | 'email' | 'avatar' | 'id' | 'role'>;
	store_name: string;
	store_logo: string | null;
	status: TSellerStatus;
	created_at: string;
	updated_at: string;
}

export type TSellerGetResult = PaginationResponse<ISeller>;
export type TGetReviewsResult = PaginationResponse<IProductReview>;
export type TGetStoreProductsResult = PaginationResponse<IProduct>;

export type TGetOrdersResult = PaginationResponse<IPurchaseResult>;
