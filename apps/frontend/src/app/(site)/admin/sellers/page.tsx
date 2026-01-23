'use client';

import dynamic from 'next/dynamic';

const AdminSellersPage = dynamic(() => import('./page.ui'), {
	ssr: false
});

export default AdminSellersPage;
