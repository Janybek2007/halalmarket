import { IUser, TUserRole } from '~/entities/user';
import { RouteGroups, RoutePaths } from '../router';

function matchesPath(pathname: string, pattern: string): boolean {
	if (pattern.endsWith('/*')) {
		return pathname.startsWith(pattern.slice(0, -1));
	} else {
		return pathname === pattern;
	}
}

export const getAllAllowedPaths = (role: TUserRole | null) => {
	const allPaths = [];
	if (!role) {
		allPaths.push(...RouteGroups.auth, ...RouteGroups.guest);
	} else {
		if (role === 'user') allPaths.push(...RouteGroups.user);
		if (role === 'seller') allPaths.push(...RouteGroups.seller);
		if (role === 'admin') allPaths.push(...RouteGroups.admin);
	}
	return allPaths;
};

export function isPathAllowed(
	pathname: string,
	role: TUserRole | null
): boolean {
	const allowed =
		role === null
			? RouteGroups.guest.some(p => matchesPath(pathname, p)) ||
			  RouteGroups.auth.some(p => matchesPath(pathname, p))
			: RouteGroups[role]?.some(p => matchesPath(pathname, p)) || false;
	return allowed;
}

export const isAuthPath = (pathname: string) =>
	RouteGroups.auth.some(p => pathname.startsWith(p));

// is seller (request, set-profile) paths
export const isSellerVRSPath = (pathname: string, user?: IUser | null) =>
	user?.role === 'seller' &&
	user?.seller &&
	[RoutePaths.Seller.SetProfile, RoutePaths.Seller.Request].some(p =>
		pathname.startsWith(p)
	);

export const isSellerOnlyOutlet = (pathname: string): boolean => {
	return [
		RoutePaths.Seller.Request,
		RoutePaths.Seller.Policy,
		RoutePaths.Seller.SetProfile
	].includes(pathname);
};

export const getFirstAllowedPage = (role: TUserRole): string => {
	switch (role) {
		case 'admin':
			return RoutePaths.Admin.Sellers;
		case 'seller':
			return RoutePaths.Seller.Products;
		case 'user':
			return RoutePaths.User.Profile;
		default:
			return RoutePaths.Guest.Home;
	}
};
