export interface CheckboxProps {
  checked: boolean;
  onChecked: (checked: boolean) => void;
  className?: string;
  color?: 'default' | 'color-1';
}
