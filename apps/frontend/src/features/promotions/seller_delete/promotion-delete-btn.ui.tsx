import React from 'react';
import { Icon } from '~/shared/ui/icon/icon.ui';
import { usePromotionDeleteMutation } from './promotion-delete.mutation';

export const DeletePromotionButton: React.FC<{ id: number }> = React.memo(({ id }) => {
	const { handleDelete } = usePromotionDeleteMutation(id);
	return (
		<button onClick={handleDelete} data-delete-btn title='Удалить'>
			<Icon name='mdi:delete-outline' width={20} />
		</button>
	);
});

DeletePromotionButton.displayName = 'DeletePromotionButton';
