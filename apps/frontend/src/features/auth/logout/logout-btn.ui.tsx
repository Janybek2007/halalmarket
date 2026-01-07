import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';

import { LogoutBtnProps } from './logout-btn.types';
import { useLogoutMutation } from './logout.mutation';

export const LogoutBtn: React.FC<LogoutBtnProps> = React.memo(
	({ className, as = 'button' }) => {
		const queryClient = useQueryClient();
		const { mutateAsync } = useLogoutMutation();

		const handleLogout = React.useCallback(() => {
			toast.promise(mutateAsync(), {
				loading: 'Выход...',
				success: 'Вы успешно вышли',
				error: 'Ошибка при выходе'
			});
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
