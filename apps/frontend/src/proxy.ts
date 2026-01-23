import { NextRequest, NextResponse } from 'next/server';
import { IUser, UserService } from './entities/user';
import {
	deleteAuthCookies,
	GetAccessToken,
	GetRefreshToken,
	refreshAccessToken,
	setAuthCookies
} from './shared/api/token.server';
import { RoutePaths } from './shared/router';
import {
	getFirstAllowedPage,
	isAuthPath,
	isPathAllowed
} from './shared/utils/access-allowed';

async function getUser(
	req: NextRequest
): Promise<{ user: IUser | null; newToken?: string }> {
	try {
		const accessToken = await GetAccessToken(req);
		const refreshToken = await GetRefreshToken(req);

		if (!accessToken && !refreshToken) {
			return { user: null };
		}

		if (accessToken) {
			try {
				const user = await UserService.GetUserProfile(accessToken);
				return { user };
			} catch (err: any) {
				if (err?.status === 401 && refreshToken) {
					console.log(
						'[Middleware] Access token expired, attempting refresh...'
					);

					const tokens = await refreshAccessToken(refreshToken);
					if (tokens?.access) {
						try {
							const user = await UserService.GetUserProfile(tokens.access);
							return { user, newToken: tokens.access };
						} catch (userErr) {
							console.warn(
								'[Middleware] Failed to get user with new token',
								userErr
							);
							return { user: null };
						}
					}
				}

				console.warn('[Middleware] Error getting user:', err?.status || err);
				return { user: null };
			}
		}

		if (refreshToken) {
			console.log('[Middleware] No access token, attempting refresh...');

			const tokens = await refreshAccessToken(refreshToken);
			if (tokens?.access) {
				try {
					const user = await UserService.GetUserProfile(tokens.access);
					return { user, newToken: tokens.access };
				} catch (userErr) {
					console.warn(
						'[Middleware] Failed to get user with refreshed token',
						userErr
					);
					return { user: null };
				}
			}
		}

		return { user: null };
	} catch (err: any) {
		console.error('[Middleware] Error in getUser:', err);
		return { user: null };
	}
}

export async function proxy(req: NextRequest) {
	const url = req.nextUrl.clone();
	const path = req.nextUrl.pathname;
	const { user, newToken } = await getUser(req);

	if (user) {
		if (isAuthPath(path)) {
			url.pathname = getFirstAllowedPage(user.role);
			const response = NextResponse.redirect(url);

			if (newToken) {
				setAuthCookies(response, { access: newToken });
			}

			return response;
		}

		if (!isPathAllowed(path, user.role)) {
			url.pathname = getFirstAllowedPage(user.role);
			const response = NextResponse.redirect(url);

			if (newToken) {
				setAuthCookies(response, { access: newToken });
			}

			return response;
		}

		const response = NextResponse.next();

		if (newToken) {
			setAuthCookies(response, { access: newToken });
		}

		return response;
	}

	if (!isPathAllowed(path, null)) {
		url.pathname = RoutePaths.Auth.Login;
		url.searchParams.set('redirect', path);
		const response = NextResponse.redirect(url);
		deleteAuthCookies(response);
		return response;
	}

	const response = NextResponse.next();
	deleteAuthCookies(response);
	return response;
}

export const config = {
	matcher: [
		'/((?!_next/static|_next/image|_next/data|api/|seo/|service-worker.js|sitemap.xml|manifest.webmanifest|robots.txt|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|css|js|woff|woff2|ttf|eot)).*)'
	]
};
