import { IGetNotificationsResult } from '~/entities/notifications';

export interface NotificationContextValue {
	notifications: IGetNotificationsResult | undefined;
	unreadCount: number;
	isLoading: boolean;
	isPushSupported: boolean;
	subscriptionData: object | undefined;
	isDrawerOpen: boolean;
	toggleDrawer: VoidFunction;
}
