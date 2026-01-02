import { TSellerStatus } from '~/entities/sellers';

export const getOrderStatus = (status: any) => {
	switch (status) {
		case 'delivered':
			return 'Доставлен';
		case 'processing':
			return 'В обработке';
		case 'shipped':
			return 'Отправлен';
		case 'cancelled':
			return 'Отменен';
		default:
			return '';
	}
};

export const getSellerStatus = (status: TSellerStatus) => {
	switch (status) {
		case 'active':
			return 'Активный';
		case 'blocked':
			return 'Заблокирован';
		default:
			return '';
	}
};
