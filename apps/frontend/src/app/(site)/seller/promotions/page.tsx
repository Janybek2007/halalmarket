'use client';
import dynamic from 'next/dynamic';

const SellerPromotionsPage = dynamic(() => import('./page.ui'), {
	ssr: false
});

export default SellerPromotionsPage;
