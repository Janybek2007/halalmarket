import clsx from 'clsx';
import React from 'react';

import { useClickAway } from '~/shared/hooks/use-click-away';
import { useToggle } from '~/shared/hooks/use-toggle';

import Link from 'next/link';
import type { DropdownProps } from './dropdown.types';
import s from './styles.module.scss';

export const Dropdown = React.memo<DropdownProps>(
	({ trigger, options, className }) => {
		const [isOpen, { toggle, set }] = useToggle(false);
		const ref = useClickAway<HTMLDivElement>(() => set(false));

		return (
			<div data-dropdown className={clsx(s.dropdown, className)} ref={ref}>
				{trigger({ isOpen, toggle })}
				{isOpen && (
					<div data-options className={s.options}>
						{options?.map((option, i) => {
							if (option.custom) {
								return option.custom({
									onClose: () => set(false),
									className: s.option
								}, i);
							}
							const Component = option.to ? Link : 'button';
							return (
								<Component
									key={`key-${i}-${Date.now()}`}
									data-option
									href={option.to || '#'}
									onClick={() => {
										if (option.onClick) option.onClick();
										set(false);
									}}
									className={s.option}
								>
									{option.label}
								</Component>
							);
						})}
					</div>
				)}
			</div>
		);
	}
);
Dropdown.displayName = 'Dropdown';
