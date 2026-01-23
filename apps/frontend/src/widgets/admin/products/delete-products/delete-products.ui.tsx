'use client';
import React from 'react';

import dynamic from 'next/dynamic';
import { TGetProductsListResult } from '~/entities/products';
import { ProductDelete } from '~/features/products/admin__delete';
import { useSize } from '~/shared/hooks';
import { formatDateCustom } from '~/shared/utils/date';
import s from './styles.module.scss';

const ProductListItem = dynamic(() =>
	import('~/entities/products').then(m => ({
		default: m.ProductListItem
	}))
);

interface DeleteProductsProps {
	products: TGetProductsListResult;
}

export const DeleteProducts: React.FC<DeleteProductsProps> = ({ products }) => {
	const size = useSize('#admin-header');

	return (
		<div
			className={s.deleteProducts}
			style={{ height: `calc(82vh - ${size?.height}px)` }}
		>
			{products.results.map((product, index) => {
				return (
					<ProductListItem
						linkEnable={false}
						extra={
							<>
								<div></div>
								<div className={s.extra}>
									<span>Продавец: {product.store.seller_name}</span>
									<span>
										Дата загрузки:{' '}
										{formatDateCustom(product.created_at, 'yyyy.MM.dd')}
									</span>
									<span>
										Время: {formatDateCustom(product.created_at, 'HH:mm')}
									</span>
								</div>
							</>
						}
						key={index}
						products={[product]}
					>
						<ProductDelete className={s.deleteButton} product_id={product.id} />
					</ProductListItem>
				);
			})}
		</div>
	);
};
