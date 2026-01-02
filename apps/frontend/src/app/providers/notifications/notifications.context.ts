import { createContext, useContext } from 'react';
import { NotificationContextValue } from './notifications.types';

export const NotificationsContext = createContext<
	NotificationContextValue | undefined
>(undefined);

export const useNotifications = (_throw = true) => {
	const context = useContext(NotificationsContext);

	if (!context && _throw) {
		throw new Error(
			'useNotifications must be used within a NotificationsProvider'
		);
	}

	return context;
};
