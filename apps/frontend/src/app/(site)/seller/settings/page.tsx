'use client';
import dynamic from 'next/dynamic';

const SellerSettingsPage = dynamic(() => import('./page.ui'), {
	ssr: false
});

export default SellerSettingsPage;
