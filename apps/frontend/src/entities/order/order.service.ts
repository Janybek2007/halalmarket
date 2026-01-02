import { http } from '~/shared/api/http';
import { TId } from '~/shared/api/types';
import { IPurchaseResult } from '../purchase';

export class OrderService {
	static async GetOrder(params: TId) {
		return http.get<IPurchaseResult>(`order/${params.id}/`);
	}
}
