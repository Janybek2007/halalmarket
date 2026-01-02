import React from 'react';
import { Icon } from '~/shared/ui/icon/icon.ui';
import { usePromotionDeleteMutation } from './promotion-delete.mutation';

interface IProps {
	className: string;
	promotionId: number;
}

export const PromotionDeleteBtn: React.FC<IProps> = React.memo(
	({ className, promotionId }) => {
		const { handleDelete } = usePromotionDeleteMutation(promotionId);
		return (
			<button
				onClick={handleDelete}
				data-onlyicon
				className={className}
				title='Удалить'
			>
				<Icon name='mdi:delete-outline' width={20} />
			</button>
		);
	}
);

PromotionDeleteBtn.displayName = '_PromotionDeleteBtn_';
