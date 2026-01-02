import clsx from 'clsx';
import React from 'react';

import { Icon } from '../icon/icon.ui';
import type { ButtonProps } from './button.types';
import styles from './styles.module.scss';
import Link from 'next/link'

export const Button: React.FC<ButtonProps> = React.memo(
  ({
    children,
    variant = 'solid',
    fullWidth = false,
    disabled = false,
    className = '',
    loading = false,
    type = "button",
    leftIcon,
    rightIcon,
    loadingText,
    as,
    ...props
  }) => {
    const buttonClasses = clsx(
      styles.button,
      styles[`button--${variant}`],
      {
        [styles['button--fullWidth']]: fullWidth,
        [styles['button--loading']]: loading,
        [styles['button--disabled']]: disabled,
      },
      className
    );

    const Component = as === 'a' ? Link : 'button';

    return (
			<Component
				href={props.to || '#'}
				data-button
				className={buttonClasses}
				disabled={disabled || loading}
				type={type}
				{...props}
			>
				{loading && (
					<span data-loader className={styles.loader}>
						<Icon name='line-md:loading-loop' />
					</span>
				)}

				{!loading && leftIcon && <Icon name={leftIcon} data-left-icon />}

				{(children || loadingText) && (
					<span data-content className={styles.content}>
						{loading ? loadingText || children : children}
					</span>
				)}

				{!loading && rightIcon && <Icon name={rightIcon} data-right-icon />}
			</Component>
		);
  }
);

Button.displayName = 'Button';
