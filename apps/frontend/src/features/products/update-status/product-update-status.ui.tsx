import React from 'react';
import { Button } from '~/shared/ui/button/button.ui';
import { useProductUpdateStatusMutation } from './product-update-status.mutation';

export const ProductUpdateStatus: React.FC<{
	classNames?: { approve: string; reject: string };
	product_id: number;
	current_status: 'approved' | 'rejected' | 'pending';
}> = React.memo(({ classNames, product_id, current_status }) => {
	const { handleUpdateProductStatus, isUpdatingStatus } =
		useProductUpdateStatusMutation();

	const isApproved = current_status === 'approved';

	return (
		<>
			<Button
				className={classNames?.approve}
				disabled={isApproved || isUpdatingStatus}
				onClick={() => handleUpdateProductStatus(product_id, 'approved')}
			>
				{isApproved ? 'Подтверждено' : 'Подтвердить'}
			</Button>
			{!isApproved && (
				<Button
					className={classNames?.reject}
					onClick={() => handleUpdateProductStatus(product_id, 'rejected')}
					disabled={isUpdatingStatus}
				>
					Отклонить
				</Button>
			)}
		</>
	);
});

ProductUpdateStatus.displayName = 'ProductUpdateStatus';
