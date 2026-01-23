'use client';
import dynamic from 'next/dynamic';

export const DeleteProducts = dynamic(() =>
	import('./delete-products/delete-products.ui').then(m => m.DeleteProducts)
);

export const ModerationProducts = dynamic(() =>
	import('./moderation-products/moderation-products.ui').then(
		m => m.ModerationProducts
	)
);
