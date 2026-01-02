'use client';
import Cookies from 'js-cookie';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../constants';

export class TokenUtils {
	static GetAccessToken(): string | null {
		return Cookies.get(ACCESS_TOKEN_KEY) || null;
	}

	static GetRefreshToken(): string | null {
		return Cookies.get(REFRESH_TOKEN_KEY) || null;
	}

	static Save(tokens: Record<'access' | 'refresh', string>): void {
		Cookies.set(ACCESS_TOKEN_KEY, tokens.access);
		Cookies.set(REFRESH_TOKEN_KEY, tokens.refresh);
	}

	static Clear() {
		Cookies.remove(ACCESS_TOKEN_KEY);
		Cookies.remove(REFRESH_TOKEN_KEY);
	}
}
