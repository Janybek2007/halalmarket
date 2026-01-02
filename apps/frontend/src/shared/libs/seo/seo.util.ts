import { Metadata } from 'next';
import { APP_URL } from '~/shared/constants';
import {
	BaseIcons,
	OG_IMAGE,
	SITE_DESCRIPTION,
	SITE_NAME,
	SITE_TITLE
} from './seo.constants';
import type { $MetaProps, MetaImage } from './seo.types';

const getImageType = (image?: MetaImage) => {
	if (image?.type) return image.type;
	const extension = image?.url?.split('.').pop()?.toLowerCase();
	switch (extension) {
		case 'jpg':
		case 'jpeg':
			return 'image/jpeg';
		case 'webp':
			return 'image/webp';
		case 'svg':
			return 'image/svg+xml';
		default:
			return 'image/png';
	}
};

export const $Meta = ({
	title,
	description,
	url,
	image
}: $MetaProps): Metadata => {
	const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_TITLE;
	const fullUrl = `${APP_URL}${url || ''}`;
	const img = image?.url || OG_IMAGE;
	const width = image?.width || 1200;
	const height = image?.height || 630;
	const imgType = getImageType(image);

	return {
		title: fullTitle,
		description: description || SITE_DESCRIPTION,
		icons: BaseIcons,
		metadataBase: new URL(APP_URL!),
		alternates: {
			canonical: fullUrl,
			languages: {
				'x-default': APP_URL
			}
		},
		openGraph: {
			title: fullTitle,
			description: description || SITE_DESCRIPTION,
			url: fullUrl,
			siteName: SITE_NAME,
			images: [
				{
					url: img,
					width,
					height,
					type: imgType
				}
			],
			locale: 'ky_KG',
			type: 'website'
		},
		twitter: {
			card: 'summary_large_image',
			title: fullTitle,
			description: description || SITE_DESCRIPTION,
			images: [img],
			site: '@halalmarket',
			creator: '@iantkg'
		},
	};
};
