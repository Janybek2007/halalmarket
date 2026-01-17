'use client';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import {
	ProductService,
	TGetProductsWithCategoriesResult
} from '~/entities/products';
import { ProductSearch } from '~/shared/components/product-search/product-search.ui';
import { Categories } from '~/widgets/categories';
import { CategoryProductList } from '~/widgets/category-product-list';
import s from './page.module.scss';

export function HomePage(props: {
	cProducts: TGetProductsWithCategoriesResult;
}) {
	const { data: cProducts = [] } = useQuery({
		queryKey: ['get-products-with-categories'],
		queryFn: () => ProductService.GetProductsWithCategories({ per_pages: 8 }),
		initialData: props.cProducts.length > 0 ? props.cProducts : undefined
	});

	return (
		<main className={s.main}>
			<div className={clsx('container', s.container)}>
				<ProductSearch />
			</div>
			<Categories categories={cProducts} />
			<div className='container'>
				{cProducts
					.filter(category => category.products.length > 0)
					?.map(category => {
						return (
							<CategoryProductList
								key={category.id}
								products={category.products}
								title={category.name}
								slug={category.slug}
							/>
						);
					})}
			</div>
		</main>
	);
}
