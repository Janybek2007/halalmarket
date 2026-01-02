'use client';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { CartProvider } from '~/entities/cart';
import { USER_PROFILE_KEY, UserService } from '~/entities/user';
import { NotificationsProvider } from '../notifications/notifications.provider.ui';
import { SWProvider } from '../sw';
import { SessionContext } from './session.context';

export const SessionProvider: React.FC<React.PropsWithChildren> = props => {
	const query = useQuery({
		queryKey: USER_PROFILE_KEY,
		queryFn: async () => UserService.GetUserProfile()
	});

	const TagWithUser =
		query.data?.role === 'user' ? CartProvider : React.Fragment;

	return (
		<SessionContext.Provider
			value={{ user: query.data || null, isLoading: query.isLoading }}
		>
			{!query.data || query.data?.role === 'user' ? (
				<TagWithUser>{props.children}</TagWithUser>
			) : (
				<SWProvider>
					<NotificationsProvider>{props.children}</NotificationsProvider>
				</SWProvider>
			)}
		</SessionContext.Provider>
	);
};
