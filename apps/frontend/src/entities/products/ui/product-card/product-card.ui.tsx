import React from 'react';

import Link from 'next/link';
import { AddCartProductBtn } from '~/features/cart/product/add';
import { FavoriteToggleBtn } from '~/features/favorites/toggle';
import { ProductImages } from '~/shared/components/product-images/product-images.ui';
import { RoutePaths } from '~/shared/router';
import { discountedPrice, priceFormat } from '~/shared/utils/price';
import { IProduct } from '../../products.types';
import s from './styles.module.scss';

export const ProductCard: React.FC<{ product: IProduct }> = React.memo(
	({ product }) => {
		const displayedName =
			product.name.slice(0, 50) + (product.name.length > 50 ? '...' : '');

		return (
			<div className={s.productCard}>
				<FavoriteToggleBtn
					default={product.is_favorite}
					s={s}
					productId={product.id}
				/>

				<div className={s.content}>
					<Link
						prefetch={false}
						href={RoutePaths.Guest.ProductDetail(product.slug)}
						className={s.productLink}
					>
						<ProductImages images={product.images} alt={product.name} />

						<div className={s.productInfo}>
							<div className={s.priceRow}>
								<span className={s.price}>
									{priceFormat(
										discountedPrice(product.price, product.discount)
									)}
								</span>
								{Number(product.discount) > 0 && (
									<span
										className={s.discountedPrice}
										style={{ textDecoration: 'line-through', color: 'gray' }}
									>
										{priceFormat(product.price)}
									</span>
								)}
							</div>

							<h3 className={s.productName}>
								{displayedName}
								{product.name.length > 50 && <span>{'Читать далее'}</span>}
							</h3>
						</div>
					</Link>

					<AddCartProductBtn
						cs={{ btn: s.addToCartButton, img: s.cartIcon }}
						id={product.id}
					/>
				</div>
			</div>
		);
	}
);

ProductCard.displayName = 'ProductCard';
