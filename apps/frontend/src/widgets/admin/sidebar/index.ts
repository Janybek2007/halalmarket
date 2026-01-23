'use client';
import dynamic from 'next/dynamic';

export const Sidebar = dynamic(() => import('./sidebar.ui'), {
	ssr: false
});
