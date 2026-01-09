import { API_URL } from '../constants';
import { HttpClient } from '../libs/http';
import { TokenUtils } from './token.client';

let token = '';

if (typeof window !== 'undefined') {
	token = TokenUtils.GetAccessToken() || '';
}

export const http = new HttpClient({
	baseURL: `${API_URL}/api`,
	credentials: 'include',
	headers: {
		Authorization: `Bearer ${token}`
	}
});
