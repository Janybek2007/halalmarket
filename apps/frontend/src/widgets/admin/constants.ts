import { Assets } from '~/shared/assets';
import { RoutePaths } from '~/shared/router';

interface MenuItem {
	name: string;
	path: string;
	img?: string;
	icon?: string;
	action?: string;
}

export const menuItems: MenuItem[] = [
	{
		name: 'Продавцы',
		path: RoutePaths.Admin.Sellers,
		img: Assets.SellersSvg
	},
	{
		name: 'Акции',
		path: RoutePaths.Admin.Promotions,
		img: Assets.PromotionsSvg
	},
	{
		name: 'Категории',
		path: RoutePaths.Admin.Categories,
		icon: 'iconamoon:category-fill'
	},
	{
		name: 'Товары',
		path: RoutePaths.Admin.Products,
		img: Assets.ProductsSvg
	},
	// {
	//   name: 'Аналитика',
	//   path: routePaths.admin.analytics,
	//   img: '/static-assets/svg/analytics.svg',
	// },
	{
		name: 'Вопросы и ответы',
		path: '#',
		img: Assets.FAQSvg
	},
	{
		name: 'Профиль',
		img: Assets.ProfilePrimarySvg,
		path: '#',
		action: 'view-profile'
	},
	{
		name: 'Сменить пароль',
		path: '#',
		img: Assets.ChangePasswordSvg,
		action: 'change-password'
	},
	{
		name: 'Настройки',
		path: RoutePaths.Admin.Settings,
		img: Assets.SettingsSvg
	}
];
