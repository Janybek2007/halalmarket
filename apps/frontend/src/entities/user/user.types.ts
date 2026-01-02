import { TSellerStatus } from '../sellers/sellers.types';

export type TUserRole = 'admin' | 'seller' | 'user';

export interface IUser {
	id: number;
	full_name: string;
	email: string;
	phone: string;
	avatar: string | null;
	address: string | null;
	role: TUserRole;
	is_verified: boolean;
	created_at: string;
	seller?: {
		id: string;
		status: TSellerStatus;
	};
	store?: {
		id: number;
		name: string;
		logo: string;
		created_at: string;
	};
}
