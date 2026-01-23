import { MetadataRoute } from 'next';
import { API_URL, APP_URL } from '~/shared/constants';
import { RoutePaths } from '~/shared/router';

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	if (!APP_URL) throw new Error('APP_URL не определен');

	const now = new Date();

	try {
		const categoriesRes = await fetch(`${API_URL}/api/categories/slugs/`);
		const categories: { slug: string; updated_at?: string }[] = categoriesRes.ok
			? await categoriesRes.json()
			: [];

		const productsRes = await fetch(`${API_URL}/api/products/slugs/`);
		const products: { slug: string; updated_at?: string }[] = productsRes.ok
			? await productsRes.json()
			: [];

		const sitemap: MetadataRoute.Sitemap = [
			{
				url: APP_URL,
				priority: 1.0,
				changeFrequency: 'daily',
				lastModified: now
			},
			{
				url: `${APP_URL}${RoutePaths.Guest.Categories}`,
				priority: 0.9,
				changeFrequency: 'weekly',
				lastModified: now
			},
			{
				url: `${APP_URL}${RoutePaths.Auth.Login}`,
				priority: 0.5,
				changeFrequency: 'monthly',
				lastModified: now
			},
			{
				url: `${APP_URL}${RoutePaths.Auth.Register}`,
				priority: 0.5,
				changeFrequency: 'monthly',
				lastModified: now
			}
		];

		for (const cat of categories) {
			if (!cat.slug) continue;

			const lastMod = cat.updated_at ? new Date(cat.updated_at) : now;

			sitemap.push({
				url: `${APP_URL}${RoutePaths.Guest.Category(cat.slug)}`,
				priority: 0.8,
				changeFrequency: 'weekly',
				lastModified: lastMod
			});
			sitemap.push({
				url: `${APP_URL}${RoutePaths.Guest.ProductsByCategory(cat.slug)}`,
				priority: 0.7,
				changeFrequency: 'weekly',
				lastModified: lastMod
			});
		}

		for (const product of products) {
			if (!product.slug) continue;

			const lastMod = product.updated_at ? new Date(product.updated_at) : now;

			sitemap.push({
				url: `${APP_URL}${RoutePaths.Guest.ProductDetail(product.slug)}`,
				priority: 0.8,
				changeFrequency: 'daily',
				lastModified: lastMod
			});
		}

		return sitemap;
	} catch (err) {
		console.error('❌ Ошибка при генерации sitemap:', err);
		return [
			{
				url: APP_URL,
				priority: 1,
				changeFrequency: 'daily',
				lastModified: new Date()
			}
		];
	}
}
