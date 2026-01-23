'use client';

import dynamic from 'next/dynamic';

export const SendReviewForm = dynamic(() =>
	import('./ui/send-review.ui').then(m => ({ default: m.SendReviewForm }))
);
