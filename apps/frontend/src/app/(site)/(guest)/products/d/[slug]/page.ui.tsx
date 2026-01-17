'use client';
import { useQuery } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import {
	IProduct,
	ProductService,
	TProductReviewResult
} from '~/entities/products';
import { ProductSearch } from '~/shared/components/product-search/product-search.ui';
import { ProductContent } from '~/widgets/product-detail/product-content/product-content.ui';
import { ProductReviews } from '~/widgets/product-detail/product-reviews/product-reviews.ui';
import styles from './page.module.scss';

export function ProductDetailPage(props: {
	product: IProduct | null;
	reviews: TProductReviewResult | null;
	slug: string;
}) {
	const productQuery = useQuery({
		queryKey: ['get-product', props.slug],
		queryFn: () => ProductService.GetProduct(props.slug),
		initialData: props.product ?? undefined
	});

	if (!productQuery.data) {
		notFound();
	}

	return (
		<main className={styles.productDetail}>
			<div className='container'>
				<ProductSearch className={styles.productSearch} />
				<ProductContent product={productQuery.data} />
				<Suspense>
					<ProductReviews
						initialReviews={props.reviews}
						slug={props.slug}
						average_rating={productQuery.data.average_rating}
					/>
				</Suspense>
			</div>
		</main>
	);
}
