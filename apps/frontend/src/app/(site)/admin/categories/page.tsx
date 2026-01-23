'use client';
import dynamic from 'next/dynamic';

const AdminCategoriesPage = dynamic(() => import('./page.ui'), {
	ssr: false
});

export default AdminCategoriesPage;
