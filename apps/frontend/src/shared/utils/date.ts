// utils/date.ts или где у тебя лежит
export function formatDate(
	dateInput: Date | string | number,
	options: {
		format?: 'short' | 'medium' | 'long' | 'full' | 'custom';
		customPattern?: string;
	} = {}
) {
	const { format = 'medium', customPattern } = options;
	const date = new Date(dateInput);
	const utcDate = new Date(
		Date.UTC(
			date.getUTCFullYear(),
			date.getUTCMonth(),
			date.getUTCDate(),
			date.getUTCHours(),
			date.getUTCMinutes(),
			date.getUTCSeconds()
		)
	);

	if (format === 'custom' && customPattern) {
		return customPattern
			.replace('dd', String(utcDate.getUTCDate()).padStart(2, '0'))
			.replace('MM', String(utcDate.getUTCMonth() + 1).padStart(2, '0'))
			.replace('yyyy', String(utcDate.getUTCFullYear()))
			.replace('HH', String(utcDate.getUTCHours()).padStart(2, '0'))
			.replace('mm', String(utcDate.getUTCMinutes()).padStart(2, '0'))
			.replace('ss', String(utcDate.getUTCSeconds()).padStart(2, '0'));
	}

	const intlOptions: Intl.DateTimeFormatOptions = {
		timeZone: 'UTC',
		hour12: false
	};

	switch (format) {
		case 'short': // 31.12.2025
			Object.assign(intlOptions, {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric'
			});
			return new Intl.DateTimeFormat('ru-RU', intlOptions)
				.format(utcDate)
				.replace(/\s/g, '');
		case 'medium': // 31 дек. 2025 г.
			Object.assign(intlOptions, {
				day: '2-digit',
				month: 'short',
				year: 'numeric'
			});
			return new Intl.DateTimeFormat('ru-RU', intlOptions).format(utcDate);
		case 'long': // 31 декабря 2025 г.
			Object.assign(intlOptions, {
				day: '2-digit',
				month: 'long',
				year: 'numeric'
			});
			return new Intl.DateTimeFormat('ru-RU', intlOptions).format(utcDate);
		case 'full':
			Object.assign(intlOptions, {
				day: '2-digit',
				month: 'long',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit'
			});
			return new Intl.DateTimeFormat('ru-RU', intlOptions).format(utcDate);
		default:
			return new Intl.DateTimeFormat('ru-RU', { timeZone: 'UTC' }).format(
				utcDate
			);
	}
}

export const formatDateCustom = (
	date: Date | string | number,
	pattern: string
) => formatDate(date, { format: 'custom', customPattern: pattern });
