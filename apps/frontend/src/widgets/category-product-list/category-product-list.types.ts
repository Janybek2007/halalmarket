import { IProduct } from '~/entities/products';

export interface CategoryProductListProps {
	title?: string;
	slug?: string;
	products: IProduct[];
	isHeader?: boolean;
}
