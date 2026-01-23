'use client';
import dynamic from 'next/dynamic';

const SellerOrdersPage = dynamic(() => import('./page.ui'), {
	ssr: false
});

export default SellerOrdersPage;
