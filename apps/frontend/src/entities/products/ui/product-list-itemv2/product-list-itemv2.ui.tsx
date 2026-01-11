'use client';
import React, { useState } from 'react';

import { ProductImages } from '~/shared/components/product-images/product-images.ui';
import {
	getProductEquipment,
	getProductExpirationDate
} from '~/shared/utils/get-product-key-els';
import { discountedPrice, priceFormat } from '~/shared/utils/price';
import type { ProductListItemv2Props } from './product-list-itemv2.types';
import s from './styles.module.scss';

const DESCRIPTION_LIMIT = 300;

export const ProductListItemv2: React.FC<ProductListItemv2Props> = React.memo(
	({ product, children }) => {
		const [isExpanded, setIsExpanded] = useState(false);

		const toggleDescription = React.useCallback(
			() => setIsExpanded(prev => !prev),
			[]
		);

		const renderDescription = React.useCallback(() => {
			if (!product.description) return null;

			if (isExpanded || product.description.length <= DESCRIPTION_LIMIT) {
				return product.description;
			}

			return product.description.slice(0, DESCRIPTION_LIMIT) + '...';
		}, [isExpanded, product.description]);

		return (
			<div className={s.productItem}>
				<div className={s.header}>
					<div className={s.productInfo}>
						<ProductImages
							classNames={{
								container: s.productImage
							}}
							mediaOpts={{ w: 166, h: 166 }}
							images={product.images}
							alt={product.name}
						/>
						<div className={s.productDetails}>
							<div className={s.col}>
								<h3 className={s.productName}>{product.name}</h3>
								<div className={s.productPrice}>
									<span>{priceFormat(product.price, 'сом')}</span>{' '}
									{Number(product.discount) > 0 && (
										<span style={{ color: 'gray' }}>
											(с учетем скидки:{' '}
											{priceFormat(
												discountedPrice(product.price, product.discount),
												'сом'
											)}
											)
										</span>
									)}
								</div>
							</div>
							{product.quantity && (
								<div className={s.infoRow}>
									<span className={s.infoLabel}>
										Количество предметов в упаковке:
									</span>
									<span className={s.infoValue}>{product.quantity}шт</span>
								</div>
							)}
							{product.composition && (
								<div className={s.infoRow}>
									<span className={s.infoLabel}>Состав:</span>
									<span className={s.infoValue}>{product.composition}</span>
								</div>
							)}
							{product.action && (
								<div className={s.infoRow}>
									<span className={s.infoLabel}>Действие:</span>
									<span className={s.infoValue}>{product.action}</span>
								</div>
							)}
							{product.expiration_date && (
								<div className={s.infoRow}>
									<span className={s.infoLabel}>Срок годности:</span>
									<span className={s.infoValue}>
										{getProductExpirationDate(product.expiration_date)}
									</span>
								</div>
							)}
							{product.equipment && (
								<div className={s.infoRow}>
									<span className={s.infoLabel}>Комплектация:</span>
									<span className={s.infoValue}>
										{getProductEquipment(product.equipment)}
									</span>
								</div>
							)}
						</div>
					</div>
				</div>

				<div className={s.description}>
					<h4 className={s.descriptionTitle}>Описание товара:</h4>
					<div className={s.descriptionList}>
						{renderDescription()}
						{product.description.length > DESCRIPTION_LIMIT && (
							<button
								className={s.toggleDescription}
								onClick={toggleDescription}
							>
								{isExpanded ? 'Свернуть' : 'Читать далее'}
							</button>
						)}
					</div>
				</div>
				{children}
			</div>
		);
	}
);

ProductListItemv2.displayName = '_ProductListItemv2_';
