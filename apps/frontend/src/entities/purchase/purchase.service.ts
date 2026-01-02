import { http } from '~/shared/api/http';
import { TGetPurchasesParams, TGetPurchasesResult } from './purchase.types';

export class PurchasesService {
	static async GetPurchases(params: TGetPurchasesParams) {
		return http.get<TGetPurchasesResult>('purchases/', {
			query: {
				...params,
				statuses: (params.statuses || []).join(',')
			}
		});
	}
}
