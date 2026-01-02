import clsx from 'clsx';
import React from 'react';

import { Icon } from '../icon/icon.ui';
import type { InputProps } from './input.types';
import styles from './styles.module.scss';

export const Input: React.FC<InputProps> = React.memo(
	({
		variant = 'default',
		className = '',
		startIcon,
		endIcon,
		endIconClick,
		fullWidth = false,
		register,
		...props
	}) => {
		const inputWrapperClasses = clsx(
			styles.inputWrapper,
			styles[`inputWrapper--${variant}`],
			{
				[styles['inputWrapper--fullWidth']]: fullWidth,
				[styles['inputWrapper--disabled']]: props.disabled
			},
			className
		);

		const inputClasses = clsx(styles.input, {
			[styles['input--withStartIcon']]: !!startIcon,
			[styles['input--withEndIcon']]: !!endIcon
		});

		return (
			<div data-input-wrapper className={inputWrapperClasses}>
				<div data-input-container className={styles.inputContainer}>
					{startIcon && (
						<div data-start-icon className={styles.startIcon}>
							<Icon name={startIcon} />
						</div>
					)}

					{props.type === 'textarea' ? (
						<textarea
							data-input
							className={inputClasses}
							{...props}
							{...register}
						/>
					) : (
						<input
							data-input
							className={inputClasses}
							{...props}
							{...register}
						/>
					)}

					{endIcon && (
						<button
							data-end-icon
							type='button'
							className={styles.endIcon}
							onClick={endIconClick}
						>
							<Icon name={endIcon} />
						</button>
					)}
				</div>
			</div>
		);
	}
);

Input.displayName = 'Input';
