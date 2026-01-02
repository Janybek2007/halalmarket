import React from 'react';
import { Icon } from '~/shared/ui/icon/icon.ui';
import { useCartProductDeleteMutation } from './cart-delete.mutation';

interface IProps {
	className: string;
	onClose: VoidFunction;
	cartId: number;
}

export const CartProductDeleteBtn: React.FC<IProps> = React.memo(
	({ className, cartId, onClose }) => {
		const { handleRemove } = useCartProductDeleteMutation(cartId, onClose);
		return (
			<button data-option className={className} onClick={handleRemove}>
				<Icon c_size={18} name='icon-park-outline:delete' />
				<span data-center data-danger>
					Удалить
				</span>
			</button>
		);
	}
);

CartProductDeleteBtn.displayName = 'CartProductDeleteBtn';
