import clsx from 'clsx';
import React from 'react';

import { IProduct } from '~/entities/products';
import {
	AddCartProductBtn,
	ProductBuyBtn
} from '~/features/cart/product/add/cart-add.ui';
import { SendReviewForm } from '~/features/reviews/send';
import { ProductImages } from '~/shared/components/product-images/product-images.ui';
import { Icon } from '~/shared/ui/icon/icon.ui';
import {
	getProductEquipment,
	getProductExpirationDate
} from '~/shared/utils/get-product-key-els';
import { discountedPrice, priceFormat } from '~/shared/utils/price';
import styles from './styles.module.scss';
import { RenderDescription } from './ui/render-description.ui';

export const ProductContent: React.FC<{
	product: IProduct;
}> = ({ product }) => {
	return (
		<section className={styles.productContent}>
			<div className={`${styles['wrapper']}`}>
				<ProductImages
					classNames={{
						container: styles.productImageContainer,
						image: styles.productImage
					}}
					images={product.images}
					alt={product.name}
				/>
				<div className={styles.productInfo}>
					<div className={styles.productTitle}>
						<h2 className={styles.productName}>{product.name}</h2>
						<h4 className={styles.regularPrice}>
							<span>
								{priceFormat(
									discountedPrice(product.price, product.discount),
									'сом'
								)}
							</span>{' '}
						</h4>
					</div>

					<div className={styles.productDetails}>
						{product.quantity && (
							<div className={styles.detailItem}>
								<span className={styles.detailLabel}>
									Количество предметов в упаковке:
								</span>
								<span className={styles.detailValue}>{product.quantity}шт</span>
							</div>
						)}
						{product.composition && (
							<div className={styles.detailItem}>
								<span className={styles.detailLabel}>Состав:</span>
								<span className={`${styles.detailValue} ${styles.ingredient}`}>
									{product.composition}
								</span>
							</div>
						)}
						{product.action && (
							<div className={styles.detailItem}>
								<span className={styles.detailLabel}>Действие:</span>
								<span className={`${styles.detailValue} ${styles.action}`}>
									{product.action}
								</span>
							</div>
						)}
						<div className={styles.detailItem}>
							<span className={styles.detailLabel}>Срок годности:</span>
							<span className={styles.detailValue}>
								{getProductExpirationDate(product.expiration_date)}
							</span>
						</div>
						<div className={styles.detailItem}>
							<span className={styles.detailLabel}>Комплектация:</span>
							<span className={styles.detailValue}>
								{getProductEquipment(product.equipment)}
							</span>
						</div>
					</div>

					<div className={styles.productRating}>
						{Array.from({ length: 5 }, (_, index) => (
							<Icon
								key={index}
								name='material-symbols-light:star'
								className={clsx(styles.productStar, {
									[styles.activeStar]:
										index + 1 <= Number(product.average_rating)
								})}
							/>
						))}
						<span className={styles.ratingValue}>
							{parseFloat(String(product.average_rating)).toFixed(1)}
						</span>
					</div>

					<div className={styles.productActions}>
						<ProductBuyBtn cs={styles.buyButton} id={product.id} />
						<AddCartProductBtn
							id={product.id}
							cs={{ btn: styles.addToCartButton, img: styles.cartIcon }}
							img='primary'
						/>
					</div>
				</div>
			</div>
			{product.description && (
				<div className={styles.description}>
					<h4 className={styles.descriptionTitle}>Описание товара:</h4>
					<RenderDescription desc={product.description} styles={styles} />
				</div>
			)}

			<SendReviewForm slug={product.slug} />
		</section>
	);
};
