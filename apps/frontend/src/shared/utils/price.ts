export const discountedPrice = (
	price: number,
	discount: string | number = 0
) => {
	return parseInt(String(price - (price * Number(discount)) / 100));
};

export function priceFormat(price: number | string, currency = 'с'): string {
	const num = typeof price === 'string' ? Number(price) : price;
	if (isNaN(num)) return '';
	return num.toLocaleString('ru-RU').replace(/\s/g, ', ') + ' ' + currency;
}
