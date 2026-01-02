import { PaginationResponse } from '~/global';
import { TPagination } from '~/shared/api/types';

export type IGetNotificationsParams = {
	is_read?: boolean;
} & TPagination;

//

export interface INotification {
	id: number;
	title: string;
	message: string;
	notification_type: boolean;
	is_read: string;
	created_at: string;
	data: any;
}

export type IGetNotificationsResult = PaginationResponse<INotification>;
