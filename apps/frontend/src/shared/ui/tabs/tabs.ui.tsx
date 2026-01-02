import clsx from 'clsx';
import React from 'react';

import s from './styles.module.scss';
import type { TabsProps } from './tabs.types';

export const Tabs: React.FC<TabsProps> = React.memo(
	({ tabs, activeTab, onChange, className }) => {
		return (
			<div className={clsx(s.tabs, className)}>
				{tabs.map(t => (
					<button
						key={t.value}
						className={clsx(s.tab, activeTab === t.value && s.active)}
						onClick={() => onChange && onChange(t.value)}
					>
						{t.label}
					</button>
				))}
			</div>
		);
	}
);

Tabs.displayName = 'Tabs';
