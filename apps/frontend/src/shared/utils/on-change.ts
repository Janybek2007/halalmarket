import type { InputOnChange } from '../ui/input/input.types';

export const onPhoneChange = (
	e: Parameters<InputOnChange>[0],
	setValue: (value: string) => void
) => {
	const value = e.target.value;

	const digitsOnly = value.replace(/\D/g, '');

	const limitedDigits = digitsOnly.slice(0, 12);

	const formattedValue = limitedDigits.replace(
		/^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,3})/,
		(_, p1, p2, p3, p4) => {
			const parts = [p1, p2, p3, p4].filter(Boolean);
			return parts.join(' ');
		}
	);

	setValue(formattedValue);
};

export const onIdentifierChange = (
	e: Parameters<InputOnChange>[0],
	setValue: (value: string) => void
) => {
	const value = e.target.value;

	if (/^\d/.test(value)) {
		onPhoneChange(e, setValue);
		return;
	}

	const emailValue = value
		.toLowerCase()
		.replace(/[^a-z0-9@._-]/g, '')
		.replace(/\.{2,}/g, '.')
		.replace(/\s/g, '');

	setValue(emailValue);
};
