'use client';

import dynamic from 'next/dynamic';

const AdminPromotionsPage = dynamic(() => import('./page.ui'), {
	ssr: false
});

export default AdminPromotionsPage;
