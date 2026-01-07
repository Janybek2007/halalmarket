import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { USER_PROFILE_KEY } from '~/entities/user';
import { SuccessResponse } from '~/global';
import { http } from '~/shared/api/http';
import { queryClient } from '~/shared/libs/tanstack';
import { RoutePaths } from '~/shared/router';
import { TokenUtils } from '~/shared/utils/token.client';

export const useLogoutMutation = () => {
	const router = useRouter();

	return useMutation({
		mutationKey: ['auth-logout'],
		mutationFn: () => {
			return http.post<SuccessResponse>('auth/logout/', {
				refresh: TokenUtils.GetRefreshToken()
			});
		},
		onSuccess(data) {
			if (data.success) {
				TokenUtils.Clear();
				queryClient.setQueryData(USER_PROFILE_KEY, null);
				setTimeout(() => {
					router.push(RoutePaths.Guest.Home);
				}, 600);
			}
		}
	});
};
