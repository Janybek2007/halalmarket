import { InputProps } from '~/shared/ui/input/input.types'

export interface FormFieldProps {
	field?: Omit<InputProps, 'type'> & {
		value?: string | number;
		type: InputProps['type'] | 'select' | 'select-input';
		options?: { value: string | number; label: string }[];
		onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
	};
	label?: string;
	name: string;
	hint?: string;
	error?: string;
	className?: string;
	fullWidth?: boolean;
	options?: object[];
}
