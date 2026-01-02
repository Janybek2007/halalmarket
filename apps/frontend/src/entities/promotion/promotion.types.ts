import { PaginationResponse } from '~/global';
import { TPagination } from '~/shared/api/types';
import { IUser } from '../user';

export type TGetPromotionsParams = {
	_to?: number | string | null;
} & TPagination;

export type TGetPromotionsResult = PaginationResponse<IPromotion>;

export interface IPromotion {
	id: number;
	products: {
		id: number;
		name: string;
		image: string;
		slug: string;
		price: string;
		discount: string;
	}[];
	discount: string;
	thumbnail: string;
	expires_at: string;
	is_expired: boolean;
	status: 'pending' | 'active' | 'rejected';
	created_at: string;
	updated_at: string;
	seller: { user: Pick<IUser, 'id' | 'full_name' | 'phone' | 'email'> };
}
