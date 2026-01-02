import React from 'react';
import { Icon } from '~/shared/ui/icon/icon.ui';
import { useReviewDeleteMutation } from './review-delete.mutation';

interface IProps {
	className: string;
	reviewId: number;
}

export const ReviewDeleteOptionBtn: React.FC<IProps> = React.memo(
	({ className, reviewId }) => {
		const { handleRemove } = useReviewDeleteMutation();
		return (
			<button data-option onClick={() => handleRemove(reviewId)} className={className}>
				<Icon name='icon-park-outline:delete' c_size={18} />
				<span data-center data-danger>
					Удалить
				</span>
			</button>
		);
	}
);

ReviewDeleteOptionBtn.displayName = 'ReviewDeleteOptionBtn';
