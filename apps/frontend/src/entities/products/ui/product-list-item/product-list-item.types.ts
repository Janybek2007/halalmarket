import { CheckboxProps } from '~/shared/ui/checkbox/checkbox.types';
import { DropdownProps } from '~/shared/ui/dropdown/dropdown.types';
import { IProduct } from '../../products.types';

export interface ProductListItemProps<T extends IProduct> {
	products: T[];
	date?: string;
	extra?: React.ReactNode;
	children?: React.ReactNode | ((product: T) => React.ReactNode);
	checkbox?: Omit<CheckboxProps, 'additional'>;
	className?: string;
	priceKey?: string
	linkEnable?: boolean;
	options?:
		| DropdownProps['options']
		| ((product: T) => DropdownProps['options']);
}
