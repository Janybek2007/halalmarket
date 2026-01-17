import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CategoriesService } from '~/entities/categories';
import { ProductService } from '~/entities/products';
import { CPageProps } from '~/global';
import { $Meta, OG_IMAGE } from '~/shared/libs/seo';
import { RoutePaths } from '~/shared/router';
import { ProductsByCategoryPage } from './page.ui';

export async function generateMetadata(
	props: CPageProps<{ slug: string }>
): Promise<Metadata> {
	try {
		const params = await props.params;

		const categories = await CategoriesService.GetCategories({
			slug: params.slug
		});
		const data = categories[0];

		const categoryName = data.name || '';
		const categorySlug = data.slug || '';
		const categoryImage = data.image || OG_IMAGE;

		return $Meta({
			title: `${categoryName} | Товары`,
			description: `Халяльные товары из категории ${categoryName}. Широкий выбор сертифицированных халяльных продуктов с доставкой по всему Кыргызстану.`,
			url: RoutePaths.Guest.ProductsByCategory(categorySlug),
			image: { url: categoryImage }
		});
	} catch (err: any) {
		if (err?.status === 404) {
			return $Meta({
				title: `Категория не найдена`
			});
		}

		return $Meta({
			title: `Ошибка при получение категории`
		});
	}
}

export default async (
	props: CPageProps<{ slug: string }, { page: string }>
) => {
	const params = await props.params;
	const sp = await props.searchParams;
	let data: any = { results: [], category: null };
	try {
		data = await ProductService.GetProducts({
			category: params.slug,
			page: sp.page,
			per_pages: 12
		});
	} catch (err) {
		notFound();
	}

	return <ProductsByCategoryPage slug={params.slug} data={data} />;
};
