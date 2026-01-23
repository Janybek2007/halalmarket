'use client';
import dynamic from 'next/dynamic';

const SellerPolicyPage = dynamic(() => import('./page.ui'), {
	ssr: false
});

export default SellerPolicyPage;
