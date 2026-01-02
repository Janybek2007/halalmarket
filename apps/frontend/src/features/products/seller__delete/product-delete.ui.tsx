import React from 'react';
import { Button } from '~/shared/ui/button/button.ui';
import { Icon } from '~/shared/ui/icon/icon.ui';
import { useProductDeleteMutation } from './product-delete.mutation';

export const ProductDelete: React.FC<{
	className: string;
	product_id: number;
}> = React.memo(({ className, product_id }) => {
	const { handleDeleteProduct, isDeletingProduct } = useProductDeleteMutation();
	return (
		<Button
			className={className}
			onClick={() => handleDeleteProduct(product_id)}
		>
			<Icon
				name={
					isDeletingProduct
						? 'line-md:loading-loop'
						: 'icon-park-outline:delete'
				}
				c_size={18}
			/>
		</Button>
	);
});

ProductDelete.displayName = 'ProductDelete';
