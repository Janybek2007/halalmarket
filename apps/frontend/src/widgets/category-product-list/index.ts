import { lazy } from 'react';

export const CategoryProductList = lazy(
	() => import('./category-product-list.ui')
);
