'use client';

import { IMAGE_URL } from './shared/constants';

export default function myImageLoader(props: {
	src: string;
	width: number;
	quality?: number;
}) {
	const { src, quality = 85 } = props;
	const [fullSrc, sizes] = src.split('|');

	let isMedia = false;
	let size = { w: props.width, h: props.width };

	if (sizes) {
		try {
			const parsed = JSON.parse(sizes);
			if (parsed?.is_media) {
				isMedia = true;
				if (parsed?.w && parsed?.h) {
					size = parsed;
				}
			}
		} catch (err) {
			console.warn('Не удалось распарсить sizes, использую fallback:', sizes);
		}
	}

	if (!isMedia) {
		return fullSrc;
	}

	const fullUrl = `${IMAGE_URL}${fullSrc}?w=${size.w}&h=${size.h}&q=${quality}`;
	return fullUrl;
}
