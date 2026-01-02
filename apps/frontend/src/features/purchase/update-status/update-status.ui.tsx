import React from 'react';
import { TOrderStatus } from '~/entities/purchase';
import { usePurchaseUpdateStatusMutation } from './update-status.mutation';

export const PurchaseUpdateStatus: React.FC<{
	status: TOrderStatus;
	id: number;
}> = React.memo(({ status, id }) => {
	const { handleCancelPurchase, handleDeliveredPurchase } =
		usePurchaseUpdateStatusMutation();
	return (
		<div data-cn='statusActions'>
			{status !== 'processing' && (
				<button
					data-cn={`statusBadge`}
					data-status='delivered'
					onClick={() => handleDeliveredPurchase(id)}
				>
					Получил
				</button>
			)}
			<button
				data-cn={`statusBadge`}
				data-status='cancelled'
				onClick={() => handleCancelPurchase(id)}
			>
				Отменить
			</button>
		</div>
	);
});

PurchaseUpdateStatus.displayName = 'PurchaseUpdateStatus';
