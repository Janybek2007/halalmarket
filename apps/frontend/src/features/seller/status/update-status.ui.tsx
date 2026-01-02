import React from 'react';
import { Icon } from '~/shared/ui/icon/icon.ui';
import { useSellersUpdateStatusMutation } from './update-status.mutation';

interface IProps {
	status: 'active' | 'blocked';
	refetch: VoidFunction;
	className: string;
	ids: string[];
}

export const SellerStatusToggleBtn : React.FC<IProps> = React.memo(
	({ className, refetch, status, ids }) => {
		const { handleUpdateStatus } = useSellersUpdateStatusMutation(ids, refetch);
		return (
			<button
				className={className}
				onClick={() => handleUpdateStatus(status)}
				data-option
			>
				<Icon
					c_size={20}
					name={status == 'active' ? 'gg:unblock' : 'ic:twotone-block'}
				/>
				<span data-primary>
					{status == 'active' ? 'Разблокировать' : 'Заблокировать'}
				</span>
			</button>
		);
	}
);

SellerStatusToggleBtn .displayName = 'SellerStatusToggleBtn ';
