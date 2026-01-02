import React from 'react';
import { useOrderUpdateStatusMutation } from './update-status.mutation';

export const OrderUpdateStatus: React.FC<{ id: number }> = React.memo(
	({ id }) => {
		const { handleShip } = useOrderUpdateStatusMutation();
		return (
			<div data-cn='statusActions'>
				<button
					data-cn='statusBadge'
					data-status='shipped'
					onClick={() => handleShip(id)}
				>
					Отправить
				</button>
			</div>
		);
	}
);

OrderUpdateStatus.displayName = 'OrderUpdateStatus';
