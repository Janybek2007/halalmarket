import { http } from '~/shared/api/http';
import { TGetPromotionsParams, TGetPromotionsResult } from './promotion.types';

export class PromotionService {
	static GetPromotions(params: TGetPromotionsParams) {
		return http.get<TGetPromotionsResult>('promotions/', {
			query: params
		});
	}
}
