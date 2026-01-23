'use client';
import dynamic from 'next/dynamic';

const SellerSetProfilePage = dynamic(() => import('./page.ui'), {
	ssr: false
});

export default SellerSetProfilePage;
