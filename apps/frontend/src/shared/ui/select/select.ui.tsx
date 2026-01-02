import clsx from 'clsx';
import React, { useCallback, useMemo, useState } from 'react';

import { useClickAway } from '~/shared/hooks';
import { Icon } from '../icon/icon.ui';
import type { SelectOption, SelectProps } from './select.types';
import s from './styles.module.scss';

export const Select: React.FC<SelectProps> = React.memo(
	({
		options,
		value,
		onChange,
		variant = 'default',
		placeholder = 'Выберите...',
		endIcon = 'lucide:chevron-down',
		className = '',
		disabled = false,
		inputMode = false
	}) => {
		const [isOpen, setIsOpen] = useState(false);
		const [inputValue, setInputValue] = useState<string>(
			options.find(option => String(option.value) === String(value))?.label ||
				''
		);

		const selectRef = useClickAway<HTMLDivElement>(() => setIsOpen(false));

		const selectedOption = useMemo(
			() => options.find(option => String(option.value) === String(value)),
			[options, value]
		);

		const handleSelect = useCallback(
			(option: SelectOption) => {
				setInputValue(option.label);
				setIsOpen(false);
				onChange?.(option.value as string);
			},
			[onChange]
		);

		const toggleDropdown = useCallback(() => {
			if (!disabled) {
				setIsOpen(prev => !prev);
			}
		}, [disabled]);

		return (
			<div
				ref={selectRef}
				data-select-wrapper
				className={clsx(
					s.selectWrapper,
					disabled && s['selectWrapper--disabled'],
					s[`selectWrapper--${variant}`],
					placeholder && !value && s['selectWrapper--placeholder'],
					className
				)}
			>
				<div
					data-select-container
					className={s.selectContainer}
					role='button'
					tabIndex={0}
					aria-haspopup='listbox'
					aria-expanded={isOpen}
					onClick={!inputMode ? toggleDropdown : undefined}
					onKeyDown={e => {
						if (
							!inputMode &&
							(e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar')
						) {
							e.preventDefault();
							toggleDropdown();
						}
					}}
				>
					{inputMode ? (
						<input
							type='text'
							value={inputValue}
							placeholder={placeholder}
							disabled={disabled}
							onChange={e => {
								setInputValue(e.target.value);
								setIsOpen(true);
								onChange?.(e.target.value);
							}}
							onFocus={() => setIsOpen(true)}
							className={s.selectValue}
						/>
					) : (
						<div
							data-select-value
							data-selected={!!selectedOption}
							className={s.selectValue}
						>
							{selectedOption ? selectedOption.label : placeholder}
						</div>
					)}

					{endIcon && !inputMode && (
						<div
							data-select-end-icon
							className={clsx(s.endIcon, isOpen && s.rotated)}
						>
							<Icon name={endIcon} />
						</div>
					)}
				</div>

				{isOpen && options.length > 0 && (
					<div data-select-dropdown className={s.dropdown}>
						{options.map(option => (
							<div
								key={option.value}
								data-select-option
								role='option'
								aria-selected={option.value === value}
								tabIndex={0}
								className={clsx(s.option, option.value === value && s.selected)}
								onClick={e => {
									e.stopPropagation();
									handleSelect(option);
								}}
								onKeyDown={e => {
									if (
										e.key === 'Enter' ||
										e.key === ' ' ||
										e.key === 'Spacebar'
									) {
										e.preventDefault();
										handleSelect(option);
									}
								}}
							>
								{option.label}
							</div>
						))}
					</div>
				)}
			</div>
		);
	}
);

Select.displayName = 'Select';
