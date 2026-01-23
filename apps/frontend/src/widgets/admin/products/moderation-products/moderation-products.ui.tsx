'use client';
import React from 'react';

import dynamic from 'next/dynamic';
import { TGetProductsListResult } from '~/entities/products';
import { ProductDelete } from '~/features/products/admin__delete';
import { ProductUpdateStatus } from '~/features/products/update-status';
import { useSize } from '~/shared/hooks';
import s from './styles.module.scss';

interface ModerationProductsProps {
	products: TGetProductsListResult;
}

const ProductListItemv2 = dynamic(() =>
	import('~/entities/products').then(m => ({
		default: m.ProductListItemv2
	}))
);

export const ModerationProducts: React.FC<ModerationProductsProps> = ({
	products
}) => {
	const size = useSize('#admin-header');

	return (
		<div
			className={s.moderationProducts}
			style={{ height: `calc(82vh - ${size?.height}px)` }}
		>
			{products.results.map(product => (
				<ProductListItemv2 key={product.id} product={product}>
					<div className={s.actions}>
						<ProductUpdateStatus
							classNames={{
								approve: `${s.actionButton} ${
									product.moderation_type === 'approved' ? s.approved : s.pass
								}`,
								reject: `${s.actionButton} ${s.notPass}`
							}}
							product_id={product.id}
							current_status={product.moderation_type}
						/>
						<ProductDelete
							className={`${s.actionButton} ${s.delete}`}
							product_id={product.id}
						/>
					</div>
				</ProductListItemv2>
			))}
		</div>
	);
};
