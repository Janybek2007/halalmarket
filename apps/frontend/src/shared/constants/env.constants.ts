export const APP_URL = process.env.NEXT_PUBLIC_APP_URL as string;
export const API_URL = process.env.NEXT_PUBLIC_API_URL as string;
export const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL as string;
export const VAPID_PUBLIC_KEY = process.env
	.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string;

interface MediaOptions {
	w?: number;
	h?: number;
}

export const ApiMedia = (url: string, opts?: MediaOptions): string => {
	return `${url}|${JSON.stringify({ ...opts, is_media: true })}`;
};
