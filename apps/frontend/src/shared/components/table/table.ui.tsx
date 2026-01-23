/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable
} from '@tanstack/react-table';
import React, { useMemo } from 'react';

import { State } from '~/shared/components/state/state.ui';
import { Icon } from '../../ui/icon/icon.ui';
import styles from './styles.module.scss';
import { TableProps } from './table.types';

export function Table<T extends object>({
	columns,
	data,
	isLoading = false,
	emptyNode = 'Нет данных',
	className = '',
	rowKey,
	maxHeight,
	search,
	searchColumn
}: TableProps<T>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);

	const filteredData = useMemo(() => {
		if (!search || !searchColumn) return data;
		const s = search.toLowerCase();
		return data.filter(row => {
			const val = (row as any)[searchColumn];
			if (val == null) return false;
			return String(val).toLowerCase().includes(s);
		});
	}, [data, search, searchColumn]);

	const table = useReactTable({
		data: filteredData,
		columns,
		state: { sorting },
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel()
	});

	const containerClasses = [styles.tableContainer, className]
		.filter(Boolean)
		.join(' ');

	return (
		<div className={containerClasses}>
			<div
				className={styles.tableWrapper}
				style={maxHeight ? { maxHeight } : undefined}
			>
				<table className={styles.table}>
					<thead className={styles.tableHead}>
						{table.getHeaderGroups().map(headerGroup => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map(header => {
									return (
										<th
											key={header.id}
											style={{
												width: header.column.columnDef.size
											}}
											className={`${styles.tableHeader} ${
												header.column.getCanSort() ? styles.sortable : ''
											}`}
											onClick={header.column.getToggleSortingHandler()}
										>
											<div className={styles.headerContent}>
												{flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
												{header.column.getCanSort() && (
													<span className={styles.sortIcon}>
														{{
															asc: (
																<Icon name='lucide:chevron-up' c_size={18} />
															),
															desc: (
																<Icon name='lucide:chevron-down' c_size={18} />
															)
														}[header.column.getIsSorted() as string] ?? (
															<Icon
																name='lucide:chevrons-up-down'
																c_size={18}
															/>
														)}
													</span>
												)}
											</div>
										</th>
									);
								})}
							</tr>
						))}
					</thead>

					<tbody>
						{isLoading && (
							<tr>
								<td
									colSpan={columns.length}
									className={styles.loadingCell}
									style={{ textAlign: 'center' }}
								>
									<State
										icon='line-md:loading-alt-loop'
										title='Загрузка...'
										text='Пожалуйста, подождите'
									/>
								</td>
							</tr>
						)}

						{!isLoading && table.getRowModel().rows.length === 0 && (
							<tr>
								<td
									colSpan={columns.length}
									className={styles.emptyCell}
									style={{ textAlign: 'center' }}
								>
									{emptyNode}
								</td>
							</tr>
						)}

						{!isLoading &&
							table.getRowModel().rows.map((row, i) => {
								const id = rowKey ? (row.original as any)[rowKey] : `row-${i}`;
								return (
									<tr key={id} className={styles.tableRow}>
										{row.getVisibleCells().map(cell => (
											<td key={cell.id} className={styles.tableCell}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</td>
										))}
									</tr>
								);
							})}
					</tbody>
				</table>
			</div>
		</div>
	);
}
