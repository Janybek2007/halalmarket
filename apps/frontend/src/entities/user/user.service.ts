import { http } from '~/shared/api/http';
import { TokenUtils } from '~/shared/utils/token.client';
import { IUser } from './user.types';

export class UserService {
	static async GetUserProfile(token_value?: string): Promise<IUser> {
		let token = token_value ?? TokenUtils.GetAccessToken();
		return http.get<IUser>('user/profile/', {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
	}
}
