'use client';
import { TGetProductsResult } from '~/entities/products';
import { Pagination } from '~/shared/components/pagination/pagination.ui';
import { ProductSearch } from '~/shared/components/product-search/product-search.ui';
import { State } from '~/shared/components/state/state.ui';
import { usePage } from '~/shared/libs/pagination/use-page';
import { usePagination } from '~/shared/libs/pagination/use-pagination';
import { BreadcrumbItem } from '~/shared/ui/breadcrumb/breadcrumb.types';
import Breadcrumb from '~/shared/ui/breadcrumb/breadcrumb.ui';
import { CategoryProductList } from '~/widgets/category-product-list';
import s from './page.module.scss';

export function ProductsByCategoryPage(props: {
	queryData: TGetProductsResult;
	slug: string;
}) {
	const page = usePage({ per_pages: 12 });
	const pagination = usePagination({ ...page, total: props.queryData.count });
	const findCategory = props.queryData?.category;
	const results = props.queryData?.results || [];

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
				{(props.queryData?.count || 0) > 3 && (
					<Pagination className={s.pagination} {...pagination} />
				)}
			</div>
		</main>
	);
}
