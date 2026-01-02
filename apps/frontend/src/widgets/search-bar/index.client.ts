'use client';
import dynamic from 'next/dynamic';

export const DynamycSearchBar = dynamic(() => import('./search-bar.ui'), {
	ssr: false
});
