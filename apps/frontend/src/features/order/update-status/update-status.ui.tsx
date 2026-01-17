import React from 'react';
import { useOrderUpdateStatusMutation } from './update-status.mutation';

export const OrderUpdateStatus: React.FC<{ id: number; isShipped?: boolean }> =
	React.memo(({ id, isShipped = true }) => {
		const { handleShipped, handleConfirmReturn } =
			useOrderUpdateStatusMutation();

		if (!isShipped) {
			return (
				<button
					data-cn='statusBadge'
					data-status='confirm_return'
					onClick={() => handleConfirmReturn(id)}
				>
					Подтвердить возврат
				</button>
			);
		}
		return (
			<div data-cn='statusActions'>
				<button
					data-cn='statusBadge'
					data-status='shipped'
					onClick={() => handleShipped(id)}
				>
					Отправить
				</button>
			</div>
		);
	});

OrderUpdateStatus.displayName = 'OrderUpdateStatus';
