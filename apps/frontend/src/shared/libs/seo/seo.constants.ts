import { Metadata } from 'next';
import { APP_URL } from '~/shared/constants';

export const SITE_NAME = 'Халал Маркет';
export const SITE_TITLE = 'Халал Маркет';

export const SITE_DESCRIPTION =
	'Халал Маркет — 100% адал азык-түлүк жана продукциялардын онлайн дүкөнү. Эт, суусундук, таттуу, косметика жана башка бардык халал товарларды үйдөн чыкпай сатып алыңыз. Кыргызстандын бардык аймагына жеткирүү бар.';

export const OG_IMAGE = `${APP_URL}/seo/preview.png`; // 1200x630

export const BaseIcons: Metadata['icons'] = [
	{
		rel: 'icon',
		url: `${APP_URL}/seo/favicon-16x16.png`,
		sizes: '16x16',
		type: 'image/png'
	},
	{
		rel: 'icon',
		url: `${APP_URL}/seo/favicon-32x32.png`,
		sizes: '32x32',
		type: 'image/png'
	},
	{
		rel: 'icon',
		url: `${APP_URL}/seo/favicon-192x192.png`,
		sizes: '192x192',
		type: 'image/png'
	},
	{
		rel: 'icon',
		url: `${APP_URL}/seo/favicon-512x512.png`,
		sizes: '512x512',
		type: 'image/png'
	},
	{
		rel: 'icon',
		url: `${APP_URL}/seo/favicon.ico`,
		type: 'image/x-icon'
	},
	{
		rel: 'shortcut icon',
		url: `${APP_URL}/seo/favicon.ico`,
		type: 'image/x-icon'
	},
	{
		rel: 'icon',
		url: `${APP_URL}/seo/favicon.png`,
		sizes: '225x225',
		type: 'image/png'
	},
	{
		rel: 'apple-touch-icon',
		url: `${APP_URL}/seo/apple-touch-icon.png`,
		sizes: '180x180',
		type: 'image/png'
	}
];
