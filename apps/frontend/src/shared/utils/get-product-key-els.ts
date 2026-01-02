export const getProductExpirationDate = (expiration_date: string): string => {
	switch (expiration_date) {
		case '6months':
			return '6 месяцев';
		case '12months':
			return '12 месяцев';
		case '24months':
			return '24 месяца';
		default:
			return expiration_date;
	}
};

export const getProductEquipment = (equipment: string): string => {
	switch (equipment) {
		case 'box':
			return 'Коробка';
		case 'bottle':
			return 'Бутылка';
		case 'jar':
			return 'Банка';
		default:
			return equipment;
	}
};
