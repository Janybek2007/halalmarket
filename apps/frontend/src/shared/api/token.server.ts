import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { AuthResponse } from '~/features/auth/types';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../constants';
import { http } from './http';

export async function GetAccessToken(req?: NextRequest): Promise<string> {
	'use server';
	const c = (await cookies()) ?? req?.cookies;
	return c.get(ACCESS_TOKEN_KEY)?.value ?? '';
}

export async function GetRefreshToken(req?: NextRequest): Promise<string> {
	'use server';
	const c = (await cookies()) ?? req?.cookies;
	return c.get(REFRESH_TOKEN_KEY)?.value ?? '';
}

export function setAuthCookies(
	response: NextResponse,
	tokens: { access: string; refresh?: string }
) {
	response.cookies.set(ACCESS_TOKEN_KEY, tokens.access);

	if (tokens.refresh) {
		response.cookies.set(REFRESH_TOKEN_KEY, tokens.refresh);
	}
}


export async function refreshAccessToken(
	refreshToken: string
): Promise<{ access: string } | null> {
	try {
		if (!refreshToken) {
			console.warn('[Token Server] No refresh token provided');
			return null;
		}

		const data = await http.patch<AuthResponse>(
			`auth/refresh/`,
			{ refresh: refreshToken },
			{
				headers: {
					Authorization: `Bearer ${refreshToken}`
				}
			}
		);

		if (!data?.tokens?.access) {
			console.warn(
				'[Token Server] Invalid response format from refresh endpoint'
			);
			return null;
		}

		console.log('[Token Server] Token refreshed successfully');
		return { access: data.tokens.access };
	} catch (error) {
		console.error('[Token Server] Error refreshing token:', error);
		return null;
	}
}

export async function getValidAccessToken(
	req: NextRequest
): Promise<string | null> {
	const accessToken = await GetAccessToken(req);

	if (accessToken) {
		return accessToken;
	}

	const refreshToken = await GetRefreshToken(req);
	if (!refreshToken) {
		console.warn('[Token Server] No tokens available');
		return null;
	}

	console.log('[Token Server] Access token missing, attempting refresh...');
	const tokens = await refreshAccessToken(refreshToken);

	if (!tokens?.access) {
		console.warn('[Token Server] Failed to refresh access token');
		return null;
	}

	return tokens.access;
}
