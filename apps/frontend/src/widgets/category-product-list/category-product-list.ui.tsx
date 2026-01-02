'use client';
import React from 'react';

import Link from 'next/link';
import { ProductCard } from '~/entities/products';
import { RoutePaths } from '~/shared/router';
import type { CategoryProductListProps } from './category-product-list.types';
import s from './styles.module.scss';

export const CategoryProductList: React.FC<CategoryProductListProps> = ({
	title,
	products,
	isHeader = true,
	slug: categorySlug
}) => {
	return (
		<section className={s.categoryProducts}>
			<div className={s.container}>
				{isHeader && (
					<div className={s.header}>
						<h1 className={s.title}>{title}</h1>
						<Link
							href={RoutePaths.Guest.ProductsByCategory(String(categorySlug))}
							className={s.viewAll}
						>
							Смотреть все
						</Link>
					</div>
				)}

				<div className={s.grid}>
					{products.map((product, i) => (
						<ProductCard key={`${product.id}-${i}-product-key`} product={product} />
					))}
				</div>
			</div>
		</section>
	);
};

export default CategoryProductList;
