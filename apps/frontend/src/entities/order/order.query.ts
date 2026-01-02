import { queryOptions } from '@tanstack/react-query';
import { TId } from '~/shared/api/types';
import { OrderService } from './order.service';

export class OrderQuery {
	static QueryKeys = {
		GetOrder: (params: TId) => ['get-order-detail', params]
	};
	static GetOrderQuery(params: TId) {
		return queryOptions({
			queryKey: OrderQuery.QueryKeys.GetOrder(params),
			queryFn: () => OrderService.GetOrder(params)
		});
	}
}
