import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductService } from '~/entities/products';
import { CPageProps } from '~/global';
import { $Meta, OG_IMAGE } from '~/shared/libs/seo';
import { RoutePaths } from '~/shared/router';
import { ProductDetailPage } from './page.ui';

export const revalidate = 60;

export async function generateMetadata(
	props: CPageProps<{ slug: string }>
): Promise<Metadata> {
	try {
		const params = await props.params;

		const product = await ProductService.GetProduct(params.slug);

		const productName = product?.name || '';
		const productDescription = product?.description || '';
		const productSlug = product?.slug || '';
		const productImage = product?.images[0].image || OG_IMAGE;

		const cleanDescription = productDescription
			.replace(/<[^>]*>/g, '')
			.substring(0, 160);

		const metaOptions = {
			title: `${productName}`,
			description:
				cleanDescription ||
				`Купить ${productName} в интернет-магазине Халал Маркет. 100% халяльный продукт с доставкой по всему Кыргызстану.`,
			url: RoutePaths.Guest.ProductDetail(productSlug),
			image: { url: productImage }
		};

		return $Meta(metaOptions);
	} catch (err: any) {
		if (err?.status === 404) {
			return $Meta({
				title: `Продукт не найден`
			});
		}

		return $Meta({
			title: `Ошибка при получении продукта`
		});
	}
}

export default async (
	props: CPageProps<{ slug: string }, { page: string }>
) => {
	const params = await props.params;
	const sp = await props.searchParams;
	let product = null;
	let reviews = null;

	try {
		product = await ProductService.GetProduct(params.slug);

		if (product) {
			reviews = await ProductService.GetProductReviews({
				slug: params.slug,
				page: Number(sp.page || 1),
				per_pages: 6
			});
		}
	} catch (err: any) {
		console.log('Ошибка при получении продукта', JSON.stringify(err));
		notFound();
	}

	return (
		<ProductDetailPage product={product} reviews={reviews} slug={params.slug} />
	);
};
