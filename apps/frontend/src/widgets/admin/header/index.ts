'use client';
import dynamic from 'next/dynamic';

export const Header = dynamic(() => import('./header.ui'), {
	ssr: false
});
