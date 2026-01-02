import { PaginationResponse } from '~/global';
import { TPagination } from '~/shared/api/types';
import { IProduct } from '../products';
import { IUser } from '../user';

export type TOrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type TGetPurchasesParams = {
	_to?: number;
	statuses?: TOrderStatus[];
} & TPagination;

export interface IPurchaseItem {
	id: number;
	product: IProduct;
	quantity: number;
	total_price: number;
	created_at: string;
}

export interface IPurchaseResult {
	id: number;
	status: TOrderStatus;
	created_at: string;
	delivery_date: string;
	total_price: number;
	orders: IPurchaseItem[];
	user: Pick<IUser, 'id' | 'full_name' | 'phone' | 'email'>;
}

//

export type TGetPurchasesResult = PaginationResponse<IPurchaseResult>;
