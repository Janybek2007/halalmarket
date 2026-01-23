'use client';

import dynamic from 'next/dynamic';

const AdminProductsPage = dynamic(() => import('./page.ui'), {
	ssr: false
});

export default AdminProductsPage;
