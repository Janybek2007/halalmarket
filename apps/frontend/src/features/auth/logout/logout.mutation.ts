import { useMutation } from '@tanstack/react-query';
import { SuccessResponse } from '~/global';
import { http } from '~/shared/api/http';
import { TokenUtils } from '~/shared/utils/token.client';

export const useLogoutMutation = () => {
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
			}
		}
	});
};
