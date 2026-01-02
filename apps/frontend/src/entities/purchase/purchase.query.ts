import { queryOptions } from '@tanstack/react-query';
import { PurchasesService } from './purchase.service';
import { TGetPurchasesParams } from './purchase.types';

export class PurchasesQuery {
	static QueryKeys = {
		GetPurchases: (params: TGetPurchasesParams) => ['get-purchases', params]
	};

	static GetPurchasesQuery(params: TGetPurchasesParams) {
		return queryOptions({
			queryKey: PurchasesQuery.QueryKeys.GetPurchases(params),
			queryFn: () => PurchasesService.GetPurchases(params)
		});
	}
}
