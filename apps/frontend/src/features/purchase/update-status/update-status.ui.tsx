import React from 'react';
import { TOrderStatus } from '~/entities/purchase';
import { usePurchaseUpdateStatusMutation } from './update-status.mutation';

export const PurchaseUpdateStatus: React.FC<{
	status: TOrderStatus;
	id: number;
}> = React.memo(({ status, id }) => {
	const { handleCancelPurchase, handleDeliveredPurchase, handleRequestReturn } =
		usePurchaseUpdateStatusMutation();

	return (
		<div data-cn='statusActions'>
			{/* PENDING - можно отменить */}
			{status === 'pending' && (
				<button
					data-cn='statusBadge'
					data-status='cancelled'
					onClick={() => handleCancelPurchase(id)}
				>
					Отменить
				</button>
			)}

			{/* SHIPPED - можно подтвердить получение */}
			{status === 'shipped' && (
				<button
					data-cn='statusBadge'
					data-status='delivered'
					onClick={() => handleDeliveredPurchase(id)}
				>
					Получил
				</button>
			)}

			{/* SHIPPED - можно запросить возврат */}
			{status === 'shipped' && (
				<button
					data-cn='statusBadge'
					data-status='cancellation_requested'
					onClick={() => handleRequestReturn(id)}
				>
					Запросить возврат
				</button>
			)}

			{/* CANCELLATION_REQUESTED - ожидание подтверждения продавца */}
			{status === 'cancellation_requested' && (
				<span data-cn='statusBadge' data-status='cancellation_requested'>
					Ожидание подтверждения возврата
				</span>
			)}
		</div>
	);
});

PurchaseUpdateStatus.displayName = 'PurchaseUpdateStatus';
