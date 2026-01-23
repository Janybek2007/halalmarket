'use client';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import {
	IProduct,
	ProductService,
	TProductReviewResult
} from '~/entities/products';
import { ProductSearch } from '~/shared/components/product-search/product-search.ui';
import styles from './page.module.scss';

const ProductContent = dynamic(() =>
	import('~/widgets/product-detail/product-content/product-content.ui').then(
		m => ({ default: m.ProductContent })
	)
);

const ProductReviews = dynamic(() =>
	import('~/widgets/product-detail/product-reviews/product-reviews.ui').then(
		m => ({ default: m.ProductReviews })
	)
);

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
				<ProductReviews
					initialReviews={props.reviews}
					slug={props.slug}
					average_rating={productQuery.data.average_rating}
				/>
			</div>
		</main>
	);
}
