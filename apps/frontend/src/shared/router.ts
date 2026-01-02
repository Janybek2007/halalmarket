import { TUserRole } from '~/entities/user';

export const RoutePaths = {
	Guest: {
		Home: '/',
		Categories: '/categories',
		Category: (slug: string) => `/category/${slug}`,
		ProductsByCategory: (slug: string) => `/products/c/${slug}`,
		ProductDetail: (slug: string) => `/products/d/${slug}`
	},
	Auth: {
		Login: '/auth/login',
		Register: '/auth/register',
		Forgot: '/auth/forgot',
		ResetPassword: '/auth/reset-password'
	},
	User: {
		Profile: '/profile',
		Orders: '/profile/orders',
		Favorites: '/profile/favorites',
		MyPurchases: '/profile/my_purchases',
		Cart: '/cart',
		OrderDetail: (orderId: number, isSeller = false) =>
			`/order/d/${orderId}${isSeller ? '?is_seller=true' : ''}`
	},
	Seller: {
		Products: '/seller/products',
		Orders: '/seller/orders',
		Reviews: '/seller/reviews',
		AnalyticsRoot: '/seller/analytics',
		AnalyticsRedeemed: '/seller/analytics/redeemed',
		AnalyticsOrdered: '/seller/analytics/ordered',
		Settings: '/seller/settings',
		StoreCreate: '/store/create',
		StorePolicy: '/store/policy',
		Promotions: '/seller/promotions',
		//
		Request: '/seller/request',
		SetProfile: '/seller/set-profile'
	},
	Admin: {
		Sellers: '/admin/sellers',
		Products: '/admin/products',
		Analytics: '/admin/analytics',
		Settings: '/admin/settings',
		Categories: '/admin/categories',
		Promotions: '/admin/promotions'
	}
};

export const RouteGroups: Record<TUserRole | 'guest' | 'auth', string[]> = {
	guest: Object.values(RoutePaths.Guest).map(r =>
		typeof r === 'function' ? r('*') : r
	),
	auth: Object.values(RoutePaths.Auth),
	user: [
		...Object.values(RoutePaths.User).map(r =>
			typeof r === 'function' ? r(0) : r
		),
		...Object.values(RoutePaths.Guest).map(r =>
			typeof r === 'function' ? r('*') : r
		)
	],
	seller: Object.values(RoutePaths.Seller),
	admin: Object.values(RoutePaths.Admin)
};
