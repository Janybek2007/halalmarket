import { ErrorType } from '../types/error';

const isRussianText = (text: string): boolean => /[а-яА-ЯёЁ]/.test(text);

export const getSplitedErrors = (
	errors: ErrorType | ErrorType[] | undefined
): string[] => {
	const errorMessages: string[] = [];

	// рекурсивная обработка
	const processError = (error: unknown): void => {
		if (!error) return;

		// если это массив
		if (Array.isArray(error)) {
			error.forEach(processError);
			return;
		}

		// если это объект
		if (typeof error === 'object') {
			const e = error as Record<string, unknown>;

			// проверяем стандартные поля ошибки
			const candidates = ['message', 'error', 'detail', 'non_field_errors'];
			for (const key of candidates) {
				const value = e[key];
				if (typeof value === 'string' && isRussianText(value)) {
					errorMessages.push(value);
					return;
				} else if (Array.isArray(value)) {
					value.forEach(processError);
				} else if (typeof value === 'object' && value !== null) {
					processError(value);
				}
			}

			// обрабатываем все остальные ключи
			for (const [_, value] of Object.entries(e)) {
				if (typeof value === 'string' && isRussianText(value)) {
					errorMessages.push(value);
				} else if (
					Array.isArray(value) ||
					(typeof value === 'object' && value !== null)
				) {
					processError(value);
				}
			}
			return;
		}

		// если это строка
		if (typeof error === 'string' && isRussianText(error)) {
			errorMessages.push(error);
			return;
		}
	};

	processError(errors);

	return errorMessages;
};
