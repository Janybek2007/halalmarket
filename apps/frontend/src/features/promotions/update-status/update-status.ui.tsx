import React from 'react';
import { usePromotionUpdateStatusMutation } from './update-status.mutation';

interface IProps {
	classNames: {
		approve: string;
		reject: string;
	};
	promotionId: number;
}

export const PromotionUpdateStatusBtns: React.FC<IProps> = React.memo(
	({ classNames, promotionId }) => {
		const { handleApprove, handleReject } =
			usePromotionUpdateStatusMutation(promotionId);
		return (
			<>
				<button onClick={handleApprove} className={classNames.approve}>
					Подтвердить
				</button>
				<button onClick={handleReject} className={classNames.reject}>
					Отклонить
				</button>
			</>
		);
	}
);

PromotionUpdateStatusBtns.displayName = 'PromotionUpdateStatusBtns';
