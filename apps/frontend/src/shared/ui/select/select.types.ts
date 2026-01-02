export type SelectOption = {
  value: string | number;
  label: string;
};
type SelectVariant = 'default' | 'filled' | 'outlined';
export interface SelectProps {
  options: SelectOption[];
  value?: string | number;
  variant?: SelectVariant;
  onChange?: (value: string) => void;
  inputMode?: boolean;
  placeholder?: string;
  endIcon?: string;
  className?: string;
  disabled?: boolean;
}
