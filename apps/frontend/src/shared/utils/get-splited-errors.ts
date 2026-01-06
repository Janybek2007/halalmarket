import { ErrorType } from '../types/error';

export const getSplitedErrors = (
	errors: ErrorType | ErrorType[] | undefined
): string[] => {
	const errorMessages: string[] = [];

	const isRussianText = (text: string): boolean => /[а-яА-ЯёЁ]/.test(text);

	const processError = (error: unknown): void => {
		if (!error) return;

		if (Array.isArray(error)) {
			error.forEach(processError);
			return;
		}

		if (typeof error === 'object' && error !== null) {
			const e = error as Record<string, unknown>;

			// стандартные поля ошибки
			const candidates = ['message', 'error', 'detail', 'non_field_errors'];
			const processedKeys = new Set<string>();

			for (const key of candidates) {
				const value = e[key];
				if (typeof value === 'string' && isRussianText(value)) {
					if (!errorMessages.includes(value)) errorMessages.push(value);
					processedKeys.add(key);
				} else if (Array.isArray(value)) {
					value.forEach(processError);
					processedKeys.add(key);
				} else if (typeof value === 'object' && value !== null) {
					processError(value);
					processedKeys.add(key);
				}
			}

			// остальные ключи
			for (const [key, value] of Object.entries(e)) {
				if (processedKeys.has(key)) continue; // пропускаем уже обработанные
				if (typeof value === 'string' && isRussianText(value)) {
					if (!errorMessages.includes(value)) errorMessages.push(value);
				} else if (
					Array.isArray(value) ||
					(typeof value === 'object' && value !== null)
				) {
					processError(value);
				}
			}

			return;
		}

		if (typeof error === 'string' && isRussianText(error)) {
			if (!errorMessages.includes(error)) errorMessages.push(error);
		}
	};

	processError(errors);

	return errorMessages;
};
