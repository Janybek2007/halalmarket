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
	price: string;
	total_price: number;
	seller: number;
}

export interface IPurchaseResult {
	id: number;
	status: TOrderStatus;
	created_at: string;
	delivery_date: string;
	delivery_address: string;
	items: IPurchaseItem[];
	total_price: number;
	payment_status: '';
	payment_method: '';
	transaction_id: null;
	user: Pick<IUser, 'id' | 'full_name' | 'phone' | 'email'>;
}

//

export type TGetPurchasesResult = PaginationResponse<IPurchaseResult>;
