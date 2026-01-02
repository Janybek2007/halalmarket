import { IProduct } from '../products';

export interface ICart {
	id: number;
	user: string;
	product: IProduct;
	quantity: number;
	created_at: string;
	updated_at: string;
}

export interface ICartStore {
	totalCount: number;
	isEmpty: boolean;
}

export interface CartContextValue extends ICartStore {
	isLoading: boolean;
	products: (ICart & { checked: boolean })[];

	getCartItemQuantity: (cartId: number) => number;
	onCheckProduct: (cartId?: number, action?: 'check' | 'uncheck') => void;
	onChangeQuantity: (cartId: number, quantity: number) => void;
	removeProduct: (cartId: number) => void;
	changeTotals: (productId: number) => void;
}
