'use client';
import dynamic from 'next/dynamic';

const SellerReviewsPage = dynamic(() => import('./page.ui'), {
	ssr: false
});

export default SellerReviewsPage;
