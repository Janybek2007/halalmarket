import { http } from '~/shared/api/http';
import { TGetCategories, TGetCategoriesParams } from './categories.types';

export class CategoriesService {
	static async GetCategories(params: TGetCategoriesParams) {
		return http.get<TGetCategories>(`categories/`, { query: params });
	}
}
