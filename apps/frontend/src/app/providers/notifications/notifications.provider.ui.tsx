import React from 'react';
import useLocalStorageState from 'use-local-storage-state';
import { NotificationsQuery } from '~/entities/notifications';
import { useSubscriptionEffect } from '~/features/notifications/subscription';
import { useToggle } from '~/shared/hooks';
import { usePaginatedQuery } from '~/shared/libs/pagination';
import { DynamicNotificationDrawer } from '~/widgets/notification-drawer';
import { NotificationsContext } from './notifications.context';

export const NotificationsProvider: React.FC<
	React.PropsWithChildren
> = props => {
	const [subscriptionData, setSubscriptionData] = useLocalStorageState<
		object | undefined
	>('subscription_data');
	const [isPushSupported, setIsPushSupported] = React.useState(false);
	const [isDrawerOpen, { toggle: toggleDrawer }] = useToggle();
	const {
		data: notifications,
		query: { isLoading }
	} = usePaginatedQuery(NotificationsQuery.GetNotificationsQuery, {
		per_pages: 10
	});

	useSubscriptionEffect(
		subscriptionData,
		setIsPushSupported,
		setSubscriptionData
	);

	const unreadCount = React.useMemo(() => {
		return notifications?.results?.filter(n => !n.is_read).length || 0;
	}, [notifications]);

	return (
		<NotificationsContext.Provider
			value={{
				isDrawerOpen,
				isLoading,
				isPushSupported,
				notifications,
				subscriptionData,
				toggleDrawer,
				unreadCount
			}}
		>
			{isDrawerOpen && <DynamicNotificationDrawer />}
			{props.children}
		</NotificationsContext.Provider>
	);
};
