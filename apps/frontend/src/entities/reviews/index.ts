'use client';

import dynamic from 'next/dynamic';

export const ReviewItem = dynamic(() =>
	import('./ui/review-item/review-item.ui').then(m => ({
		default: m.ReviewItem
	}))
);
