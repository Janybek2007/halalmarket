import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';

import { useRouter } from 'next/navigation';
import { USER_PROFILE_KEY } from '~/entities/user';
import { RoutePaths } from '~/shared/router';
import { LogoutBtnProps } from './logout-btn.types';
import { useLogoutMutation } from './logout.mutation';

export const LogoutBtn: React.FC<LogoutBtnProps> = React.memo(
	({ className, as = 'button' }) => {
		const queryClient = useQueryClient();
		const { mutateAsync } = useLogoutMutation();
		const router = useRouter();

		const handleLogout = React.useCallback(() => {
			toast.promise(
				async () => {
					const r = await mutateAsync();

					if (r.success) {
						router.push(RoutePaths.Guest.Home);
						queryClient.refetchQueries({ queryKey: USER_PROFILE_KEY });
						setTimeout(() => {
							queryClient.setQueryData(USER_PROFILE_KEY, null);
						}, 600);
					}
				},
				{
					loading: 'Выход...',
					success: 'Вы успешно вышли',
					error: 'Ошибка при выходе'
				}
			);
		}, [mutateAsync, queryClient]);

		const Component = as === 'button' ? 'button' : 'span';

		return (
			<Component onClick={handleLogout} className={className}>
				Выйти
			</Component>
		);
	}
);

LogoutBtn.displayName = 'LogoutBtn';
