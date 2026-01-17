import { PaginationResponse } from '~/global';
import { TPagination } from '~/shared/api/types';
import { IProduct } from '../products';
import { IUser } from '../user';

export type TOrderStatus =
	| 'pending'
	| 'shipped'
	| 'delivered'
	| 'cancelled'
	| 'cancellation_requested';

export type TOrderItemStatus =
	| 'pending'
	| 'shipped'
	| 'delivered'
	| 'cancelled'
	| 'return_requested'
	| 'returned';

export type TGetPurchasesParams = {
	_to?: number;
	statuses?: TOrderStatus[];
} & TPagination;

export interface IPurchaseItem {
	id: number;
	product: IProduct;
	quantity: number;
	price: string;
	total_price: number;
	seller: number;
	status: TOrderStatus;
}

export interface IPurchaseResult {
	id: number;
	status: TOrderStatus;
	item_status: TOrderItemStatus;
	created_at: string;
	delivery_date: null | string;
	delivery_address: string;
	items: IPurchaseItem[];
	total_price: number;
	user: Pick<IUser, 'id' | 'full_name' | 'phone' | 'email'>;
}

//

export type TGetPurchasesResult = PaginationResponse<IPurchaseResult>;
