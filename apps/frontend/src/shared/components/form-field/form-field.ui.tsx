import clsx from 'clsx';
import React from 'react';

import { Input } from '~/shared/ui/input/input.ui';
import { Select } from '~/shared/ui/select/select.ui';
import type { FormFieldProps } from './form-field.types';
import styles from './styles.module.scss';

export const FormField: React.FC<FormFieldProps> = React.memo(
	({ label, name, error, className = '', fullWidth = false, field, hint }) => {
		const fieldClasses = clsx(
			styles.formField,
			{
				[styles['formField--error']]: !!error,
				[styles['formField--fullWidth']]: fullWidth
			},
			className
		);
		console.log();

		return (
			<div data-form-field className={fieldClasses}>
				{label && (
					<label htmlFor={name} data-label className={styles.label}>
						{label}
					</label>
				)}

				{field &&
					!['select', 'select-input'].includes(field.type || 'text') && (
						<Input name={name} {...field} />
					)}
				{field && ['select', 'select-input'].includes(field.type || 'text') && (
					<Select
						options={field.options || []}
						value={field.value}
						variant='default'
						inputMode={field.type == 'select-input'}
						{...field}
						onChange={v =>
							field.onChange?.({
								target: { name: field.name || name, value: v }
							})
						}
					/>
				)}
				{error && <p className={styles.error}>{error}</p>}
				{hint && <p className={styles.hint}>{hint}</p>}
			</div>
		);
	}
);

FormField.displayName = 'FormField';
