export const APP_URL = process.env.NEXT_PUBLIC_APP_URL;
export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
export const IS_DEV = process.env.NODE_ENV === 'development';

export const ApiMedia = (url: string) => {
	return ['localhost', 'www', 'halalmarket', '.kg'].some(domain =>
		url.includes(domain)
	)
		? url
		: API_URL + url;
};
