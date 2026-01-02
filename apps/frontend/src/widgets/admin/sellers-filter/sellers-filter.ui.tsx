import React from 'react';

import { DeleteSellerBtn } from '~/features/seller/delete';
import { SellerInviteWrapper } from '~/features/seller/invite';
import { SellerStatusToggleBtn } from '~/features/seller/status';
import { SellersTab } from '~/shared/types/sellers-tab';
import { Button } from '~/shared/ui/button/button.ui';
import { DropdownOption } from '~/shared/ui/dropdown/dropdown.types';
import { Dropdown } from '~/shared/ui/dropdown/dropdown.ui';
import { Input } from '~/shared/ui/input/input.ui';
import { Tabs } from '~/shared/ui/tabs/tabs.ui';
import { type SellersFilterProps } from './sellers-filter.types';
import s from './styles.module.scss';

export const SellersFilter: React.FC<SellersFilterProps> = React.memo(
	({ tab, onTab, selectedIds, searchBind, refetch }) => {
		return (
			<div className={s.filter}>
				<Tabs
					tabs={[
						{ value: SellersTab.List, label: 'Список продавцов' },
						{ value: SellersTab.Active, label: 'Активные' },
						{ value: SellersTab.Blocked, label: 'Заблокированные' }
					]}
					activeTab={tab || SellersTab.List}
					onChange={v => onTab(v as SellersTab)}
				/>
				<div className={s.end}>
					<SellerInviteWrapper />
					<Dropdown
						className={s.actionSelect}
						options={[
							tab === SellersTab.Blocked
								? ({
										custom: args => (
											<SellerStatusToggleBtn
												refetch={refetch}
												key={'update-status-btn_with_status=active'}
												status='active'
												ids={selectedIds}
												{...args}
											/>
										),
										label: ''
								  } as DropdownOption)
								: ({
										custom: args => (
											<SellerStatusToggleBtn
												refetch={refetch}
												key={'update-status-btn_with_status=blocked'}
												status='blocked'
												ids={selectedIds}
												{...args}
											/>
										),
										label: ''
								  } as DropdownOption),
							{
								custom: args => (
									<DeleteSellerBtn
										refetch={refetch}
										ids={selectedIds}
										{...args}
									/>
								),
								label: ''
							} as DropdownOption
						].filter(Boolean)}
						trigger={({ toggle }) => (
							<Button
								disabled={!selectedIds.length}
								className={s.actionsCellButton}
								onClick={toggle}
							>
								Действие
							</Button>
						)}
					/>
					<Input {...searchBind} placeholder='Поиск' className={s.input} />
				</div>
			</div>
		);
	}
);

SellersFilter.displayName = 'SellersFilter';
