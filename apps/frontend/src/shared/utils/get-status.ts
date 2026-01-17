import { TSellerStatus } from '~/entities/sellers';

export const getOrderStatus = (status: any) => {
	switch (status) {
		case 'pending':
		case 'processing':
			return 'Ожидание';
		case 'shipped':
			return 'Отправлен';
		case 'delivered':
			return 'Доставлен';
		case 'cancelled':
			return 'Отменен';
		case 'cancellation_requested':
		case 'return_requested':
			return 'Запрошен возврат';
		case 'returned':
			return 'Возвращен';
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
