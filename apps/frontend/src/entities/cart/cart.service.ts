import { http } from '~/shared/api/http';
import { ICart } from './cart.types';

export class CartService {
	static GetCart() {
		return http.get<ICart[]>('cart/');
	}
}
