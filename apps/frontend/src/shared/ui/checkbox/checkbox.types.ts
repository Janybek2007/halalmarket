export interface CheckboxProps {
  checked: boolean;
  onChecked: (checked: boolean) => void;
  className?: string;
  name?: string;
  color?: 'default' | 'color-1';
}
