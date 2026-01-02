import type {
	HTMLInputAutoCompleteAttribute,
	HTMLInputTypeAttribute
} from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

export type InputVariant = 'default' | 'filled' | 'outlined';
export type InputOnChange = (
	e:
		| React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
		| { target: { name: string; value: string; files?: FileList } }
) => void;

export interface InputProps {
	variant?: InputVariant;
	className?: string;
	startIcon?: string;
	endIcon?: string;
	fullWidth?: boolean;
	register?: UseFormRegisterReturn;
	type?: HTMLInputTypeAttribute;
	placeholder?: string;
	disabled?: boolean;
	name?: string;
	value?: string | number;
	readOnly?: boolean;
	accept?: string;
	autoComplete?: HTMLInputAutoCompleteAttribute;
	onClick?: VoidFunction;
	endIconClick?: VoidFunction;
	onChange?: InputOnChange;
}
