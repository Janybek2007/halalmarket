'use client';

import { ColumnDef } from '@tanstack/react-table';
import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';
import { ISeller, SellersQuery } from '~/entities/sellers';
import { Pagination } from '~/shared/components/pagination/pagination.ui';
import { State } from '~/shared/components/state/state.ui';
import { Table } from '~/shared/components/table/table.ui';
import { useQueryEnum } from '~/shared/hooks';
import { usePaginatedQuery } from '~/shared/libs/pagination';
import { SellersTab } from '~/shared/types/sellers-tab';
import { Avatar } from '~/shared/ui/avatar/avatar.ui';
import { Checkbox } from '~/shared/ui/checkbox/checkbox.ui';
import { getSellerStatus } from '~/shared/utils/get-status';
import { SellersFilter } from '~/widgets/admin/sellers-filter';
import s from './page.module.scss';

interface TSeller extends ISeller {
	check?: boolean;
	actions?: null;
}

export default () => {
	return (
		<Suspense>
			<AdminSellersPage />
		</Suspense>
	);
};

function AdminSellersPage() {
	const [tab, setTab] = useQueryEnum(
		'_tab',
		Object.values(SellersTab),
		SellersTab.List
	);

	const _to = useSearchParams().get('_to');
	const [searchTerm, setSearchTerm] = React.useState('');

	const {
		query: { isLoading, refetch },
		pagination,
		data: sellers
	} = usePaginatedQuery(SellersQuery.GetSellersListQuery, {
		_to,
		search: searchTerm,
		status: String(tab),
		per_pages: 12
	});

	const [filtered, setFiltered] = React.useState<TSeller[]>([]);

	React.useEffect(() => {
		if (!sellers?.results) return;
		return setFiltered(
			sellers.results.map(item => ({ ...item, check: false }))
		);
	}, [sellers]);

	const selectedIds = React.useMemo(
		() => filtered.filter(item => item.check).map(item => item.id),
		[filtered]
	);

	const toggleOne = React.useCallback(
		(id: string) => {
			setFiltered(prev =>
				prev.map(item =>
					item.id === id ? { ...item, check: !item.check } : item
				)
			);
		},
		[setFiltered]
	);

	const toggleAll = React.useCallback(
		(checked: boolean) => {
			setFiltered(prev => prev.map(item => ({ ...item, check: checked })));
		},
		[setFiltered]
	);

	const allChecked = filtered.length > 0 && filtered.every(item => item.check);

	const columns = React.useMemo<ColumnDef<TSeller>[]>(
		() => [
			{
				id: 'check',
				header: () => (
					<Checkbox
						className={s.checkbox}
						checked={allChecked}
						onChecked={() => toggleAll(!allChecked)}
						color='default'
					/>
				),
				cell: ({ row }) => (
					<Checkbox
						color='default'
						className={`${s.checkbox} ${s.rowCheckbox}`}
						checked={row.original.check || false}
						onChecked={() => toggleOne(row.original.id)}
					/>
				),
				size: 20
			},
			{
				accessorKey: 'user.full_name',
				header: 'ФИО Продавца',
				cell: ({ row }) => (
					<div className={s.sellerInfo}>
						<Avatar
							src={row.original.user.avatar}
							alt='profile'
							className={s.sellerPhoto}
							placeholder={row.original.user.full_name[0]}
							media
						/>
						<div className={s.sellerCol}>
							<span className={s.sellerName}>
								{row.original.user.full_name}
							</span>
							<span className={s.sellerRole}>Продавец</span>
						</div>
					</div>
				),
				size: 120
			},
			{
				accessorKey: 'store_name',
				header: 'Магазин',
				cell: ({ row }) => (
					<span className={s.rowValue}>
						{row.original.store_name || 'Нет'}
					</span>
				),
				size: 80
			},
			{
				accessorKey: 'user.phone',
				header: 'Телефон',
				cell: ({ row }) => (
					<span className={s.rowValue}>{row.original.user.phone}</span>
				),
				size: 120
			},
			{
				accessorKey: 'user.email',
				header: 'Email',
				cell: ({ row }) => (
					<span data-email className={s.rowValue}>
						{row.original.user.email}
					</span>
				),
				size: 120
			},
			...(tab === SellersTab.List || tab === SellersTab.Active
				? [
						{
							accessorKey: 'status',
							header: 'Статус',
							cell: ({ row }) => (
								<span className={s.rowValue}>
									{getSellerStatus(row.original.status)}
								</span>
							),
							size: 120
						} as ColumnDef<TSeller>
				  ]
				: [])
		],
		[allChecked, toggleAll, toggleOne, tab]
	);

	return (
		<main className={s.main}>
			<SellersFilter
				tab={tab}
				onTab={t => {
					setTab(t);
					setFiltered(prev => prev.map(item => ({ ...item, check: false })));
				}}
				selectedIds={selectedIds}
				refetch={refetch}
				searchBind={{
					value: searchTerm,
					onChange: e => setSearchTerm(e.target.value)
				}}
			/>

			<div className={s.tableContainer}>
				<Table
					maxHeight='60vh'
					isLoading={isLoading}
					columns={columns}
					data={filtered}
					rowKey='id'
					search={searchTerm}
					searchColumn='user.full_name'
					emptyNode={
						<State
							title={
								tab === SellersTab.Active
									? 'Нет активных продавцов'
									: tab === SellersTab.Blocked
									? 'Нет заблокированных продавцов'
									: 'Нет продавцов'
							}
							text={
								tab === SellersTab.Active
									? 'Здесь будут отображаться только активные продавцы.'
									: tab === SellersTab.Blocked
									? 'Здесь будут отображаться продавцы со статусом "заблокирован".'
									: 'В данный момент нет продавцов.'
							}
						/>
					}
				/>

				{!isLoading && Number(sellers?.count) > 12 && (
					<div className={s.paginationContainer}>
						<Pagination {...pagination} />
					</div>
				)}
			</div>
		</main>
	);
}
