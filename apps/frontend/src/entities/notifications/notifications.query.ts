import { queryOptions } from '@tanstack/react-query';
import { NotificationsService } from './notifications.service';
import { IGetNotificationsParams } from './notifications.types';

export class NotificationsQuery {
	static QueryKeys = {
		GetNotifications: (params?: IGetNotificationsParams) => [
			'get-notifications',
			params
		]
	};
	static GetNotificationsQuery(params: IGetNotificationsParams) {
		return queryOptions({
			queryKey: this.QueryKeys.GetNotifications(params),
			queryFn: () => NotificationsService.GetNotifications(params)
		});
	}
}
