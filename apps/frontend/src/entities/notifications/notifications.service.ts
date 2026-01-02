import { http } from '~/shared/api/http';
import {
	IGetNotificationsParams,
	IGetNotificationsResult
} from './notifications.types';

export class NotificationsService {
	static GetNotifications(params: IGetNotificationsParams) {
		return http.get<IGetNotificationsResult>('notifications/', {
			query: params
		});
	}
}
