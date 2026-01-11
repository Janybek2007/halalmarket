import {
	ProductService,
	TGetProductsWithCategoriesResult
} from '~/entities/products';
import { GetAccessToken } from '~/shared/api/token.server';
import { $Meta } from '~/shared/libs/seo';
import { RoutePaths } from '~/shared/router';
import { HomePage } from './page.ui';

export const revalidate = 60;

export const metadata = $Meta({
	title: 'Главная',
	description:
		'Ищите продукты и просматривайте категории с популярными товарами на нашем сайте.',
	url: RoutePaths.Guest.Home
});

export default async () => {
	let cProducts: TGetProductsWithCategoriesResult = [];
	try {
		const token = await GetAccessToken();
		cProducts = await ProductService.GetProductsWithCategories(
			{ per_pages: 8 },
			token
		);
	} catch {}

	return <HomePage cProducts={cProducts} />;
};
