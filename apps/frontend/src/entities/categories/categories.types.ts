import { BooleanString } from '~/global';

export type TGetCategoriesParams = {
	parent?: number | string;
	is_null_parent?: BooleanString;
	get_childs?: BooleanString;
	slug?: string
};

// 
export interface ICategory {
	id: number;
	name: string;
	slug: string;
	image: string;
	order: number;
	parent?: ICategory;
	childs?: ICategory[];
	actions: null;
}

export type TGetCategories = ICategory[];
