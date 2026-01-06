import { NextRequest, NextResponse } from 'next/server';
import { IUser, UserService } from './entities/user';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from './shared/constants';
import { RoutePaths } from './shared/router';
import {
	getFirstAllowedPage,
	isAuthPath,
	isPathAllowed,
	isSellerVRSPath
} from './shared/utils/access-allowed';

function deleteAuthCookies(response: NextResponse) {
	response.cookies.set(ACCESS_TOKEN_KEY, '', { maxAge: 0 });
	response.cookies.set(REFRESH_TOKEN_KEY, '', { maxAge: 0 });
}

async function getUser(req: NextRequest): Promise<IUser | null> {
	try {
		const token = req.cookies.get(ACCESS_TOKEN_KEY)?.value;
		if (!token) return null;

		const user = await UserService.GetUserProfile(token);
		return user;
	} catch (err: any) {
		console.warn('Ошибка получения пользователя', err);
		return null;
	}
}

export async function proxy(req: NextRequest) {
	const url = req.nextUrl.clone();
	const path = req.nextUrl.pathname;
	const user = await getUser(req);

	if (user) {
		if (isAuthPath(path)) {
			url.pathname = getFirstAllowedPage(user.role);
			const response = NextResponse.redirect(url);
			return response;
		}

		if (!isPathAllowed(path, user.role)) {
			url.pathname = getFirstAllowedPage(user.role);
			const response = NextResponse.redirect(url);
			return response;
		}

		return NextResponse.next();
	}

	if (!isPathAllowed(path, null)) {
		url.pathname = RoutePaths.Auth.Login;
		url.searchParams.set('redirect', path);
		const response = NextResponse.redirect(url);
		deleteAuthCookies(response);
		return response;
	}

	if (!isSellerVRSPath(path, user)) {
		const response = NextResponse.next();
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
