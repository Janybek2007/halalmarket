'use client';
import { queryOptions } from '@tanstack/react-query';
import { ProductService, TGetProductsResult } from '~/entities/products';
import { Pagination } from '~/shared/components/pagination/pagination.ui';
import { ProductSearch } from '~/shared/components/product-search/product-search.ui';
import { State } from '~/shared/components/state/state.ui';
import { usePaginatedQuery } from '~/shared/libs/pagination';
import { BreadcrumbItem } from '~/shared/ui/breadcrumb/breadcrumb.types';
import Breadcrumb from '~/shared/ui/breadcrumb/breadcrumb.ui';
import { CategoryProductList } from '~/widgets/category-product-list';
import s from './page.module.scss';

export function ProductsByCategoryPage(props: {
	data: TGetProductsResult;
	slug: string;
}) {
	const { pagination, data: queryData } = usePaginatedQuery(
		params =>
			queryOptions({
				queryKey: ['get-products', props.slug],
				queryFn: () => ProductService.GetProducts(params),
				initialData:
					props.data.results.length > 0 ? props.data : undefined
			}),
		{ per_pages: 12, category: props.slug }
	);
	const findCategory = queryData?.category;
	const results = queryData?.results || [];

	return (
		<main className={s.productsByCategoryPage}>
			<div className='container'>
				<Breadcrumb
					className={s.breadcrumb}
					items={
						[
							{
								label: 'Меню',
								path: '/categories',
								isActive: false
							},
							findCategory?.parent && {
								label: findCategory?.parent?.name || '',
								path: `/category/${findCategory?.parent?.slug}`,
								isActive: false
							},
							{
								label: findCategory?.name || '',
								path: `/category/${findCategory?.slug}`,
								isActive: true
							}
						].filter(Boolean) as BreadcrumbItem[]
					}
				/>
				<div className={s.v1}>
					<ProductSearch />
					<h4 className={s.categoryName}>{findCategory?.name}</h4>
				</div>
				{results.length === 0 ? (
					<State
						title='Товары отсутствуют'
						text='В данной категории пока нет продуктов. Попробуйте посмотреть другие категории или вернуться позже.'
					/>
				) : (
					<CategoryProductList
						isHeader={false}
						slug={findCategory?.slug}
						products={results || []}
					/>
				)}
				{(queryData?.count || 0) > 3 && (
					<Pagination className={s.pagination} {...pagination} />
				)}
			</div>
		</main>
	);
}
