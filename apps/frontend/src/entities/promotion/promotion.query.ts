import { queryOptions } from '@tanstack/react-query';
import { PromotionService } from './promotion.service';
import { TGetPromotionsParams } from './promotion.types';

export class PromotionsQuery {
	static QueryKeys = {
		GetPromotions: (params: TGetPromotionsParams) => ['get-promotions', params]
	};

	static GetPromotionsQuery(params: TGetPromotionsParams) {
		return queryOptions({
			queryKey: PromotionsQuery.QueryKeys.GetPromotions(params),
			queryFn: () => PromotionService.GetPromotions(params)
		});
	}
}
