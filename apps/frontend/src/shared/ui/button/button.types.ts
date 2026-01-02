export type ButtonVariant = 'solid' | 'outline';

export interface ButtonProps extends React.PropsWithChildren {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  loading?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  loadingText?: string;
  type?: 'button' | 'submit' | 'reset';
  as?: 'button' | 'a';
  to?: string;
  onClick?: VoidFunction;
}
