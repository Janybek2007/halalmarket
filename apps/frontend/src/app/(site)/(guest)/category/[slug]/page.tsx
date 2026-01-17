import { CategoriesService, TGetCategories } from '~/entities/categories';
import { CategoryPage } from './page.ui';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CPageProps } from '~/global';
import { $Meta, OG_IMAGE } from '~/shared/libs/seo';
import { RoutePaths } from '~/shared/router';

export async function generateMetadata(
	props: CPageProps<{ slug: string }>
): Promise<Metadata> {
	try {
		const params = await props.params;
		const categories = await CategoriesService.GetCategories({
			slug: params.slug
		});
		const data = categories[0];
		const categoryName = data?.name || 'Подкатегории';
		const categorySlug = data?.slug || '';
		const categoryImage = data?.image || OG_IMAGE;

		return $Meta({
			title: `${categoryName}`,
			description: `Подкатегории ${categoryName} в Халал Маркете. Широкий выбор халяльных товаров с доставкой по всему Кыргызстану.`,
			url: RoutePaths.Guest.Category(categorySlug),
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

export default async (props: CPageProps<{ slug: string }>) => {
	const params = await props.params;
	let categories: TGetCategories = [];

	try {
		categories = await CategoriesService.GetCategories({ parent: params.slug });
	} catch (err: any) {
		notFound();
	}

	return <CategoryPage categories={categories} slug={params.slug} />;
};
