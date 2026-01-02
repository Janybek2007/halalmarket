import clsx from 'clsx';
import { ProductService } from '~/entities/products';
import { ProductSearch } from '~/shared/components/product-search/product-search.ui';
import { $Meta } from '~/shared/libs/seo';
import { RoutePaths } from '~/shared/router';
import { GetAccessToken } from '~/shared/utils/token.server';
import { Categories } from '~/widgets/categories';
import { CategoryProductList } from '~/widgets/category-product-list';
import s from './page.module.scss';

export const metadata = $Meta({
	title: 'Главная',
	description:
		'Ищите продукты и просматривайте категории с популярными товарами на нашем сайте.',
	url: RoutePaths.Guest.Home
});

export default async function Home() {
	const token = await GetAccessToken();
	const cProducts = await ProductService.GetProductsWithCategories(
		{ per_pages: 8 },
		token
	);

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
