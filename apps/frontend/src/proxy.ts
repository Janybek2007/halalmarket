import { NextRequest, NextResponse } from 'next/server';
import { IUser, UserService } from './entities/user';
import { ACCESS_TOKEN_KEY } from './shared/constants';
import { RoutePaths } from './shared/router';
import {
	getFirstAllowedPage,
	isAuthPath,
	isPathAllowed,
	isSellerVRSPath
} from './shared/utils/access-allowed';

async function getUser(req: NextRequest): Promise<IUser | null> {
	try {
		const token = req.cookies.get(ACCESS_TOKEN_KEY)?.value;
		if (!token) return null;
		return await UserService.GetUserProfile(token);
	} catch (err: any) {
		return null;
	}
}

export async function proxy(req: NextRequest) {
	const url = req.nextUrl.clone();
	const path = req.nextUrl.pathname;
	let user = null;

	try {
		user = await getUser(req);
	} catch {}

	if (user) {
		// Если пользователь авторизован и находится на странице аутентификации, перенаправляем на первую страницу для его роли
		if (isAuthPath(path)) {
			url.pathname = getFirstAllowedPage(user.role);
			return NextResponse.redirect(url);
		}

		// Если пользователь пытается зайти не на свои страницы, перенаправляем на первую страницу роли
		if (user && !isPathAllowed(path, user.role)) {
			url.pathname = getFirstAllowedPage(user.role);
			return NextResponse.redirect(url);
		}

		// Для других случаев (например, user или если путь разрешен), продолжаем
		return NextResponse.next();
	} else {
		// Если пользователя нет и путь требует аутентификации (не guest/auth), перенаправляем на login
		if (!isPathAllowed(path, null)) {
			url.pathname = RoutePaths.Auth.Login;
			url.searchParams.set('redirect', path);
			return NextResponse.redirect(url);
		}

		// Исключения для страниц, доступных без авторизации (seller VRS paths)
		if (!isSellerVRSPath(path, user)) {
			return NextResponse.next();
		}

		// Для гостевых путей, продолжаем
		return NextResponse.next();
	}
}

export const config = {
	matcher: [
		'/((?!_next/static|_next/image|_next/data|api/|seo/|service-worker.js|sitemap.xml|manifest.webmanifest|robots.txt|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|css|js|woff|woff2|ttf|eot)).*)'
	]
};
