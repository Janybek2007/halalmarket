'use client';
import dynamic from 'next/dynamic';

const SellerProductsPage = dynamic(() => import('./page.ui'), {
	ssr: false
});

export default SellerProductsPage;
