import React from 'react';
import { Icon } from '~/shared/ui/icon/icon.ui';
import { useSellersDeleteMutation } from './delete.mutation';

interface IProps {
	refetch: VoidFunction;
	className: string;
	ids: string[];
}

export const DeleteSellerBtn: React.FC<IProps> = React.memo(
	({ className, ids, refetch }) => {
		const { handleDeleteSellers } = useSellersDeleteMutation(ids, refetch);
		return (
			<button className={className} onClick={handleDeleteSellers} data-option>
				<Icon c_size={20} name='lucide:trash' />
				<span data-danger>Удалить</span>
			</button>
		);
	}
);

DeleteSellerBtn.displayName = 'DeleteSellerBtn';
