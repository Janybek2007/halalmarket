import { PaginationResponse } from '~/global';
import { TPagination } from '~/shared/api/types';

export type IGetNotificationsParams = {
	is_read?: boolean;
} & TPagination;

export type TNotificationTypes = {}

//

export interface INotification {
	id: number;
	title: string;
	message: string;
	notification_type: number;
	is_read: boolean;
	created_at: string;
	data: any;
}

export type IGetNotificationsResult = PaginationResponse<INotification>;
