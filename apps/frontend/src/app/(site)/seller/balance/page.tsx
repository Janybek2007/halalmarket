'use client';
import dynamic from 'next/dynamic';

const SellerBalancePage = dynamic(() => import('./page.ui'), {
	ssr: false
});

export default SellerBalancePage;
