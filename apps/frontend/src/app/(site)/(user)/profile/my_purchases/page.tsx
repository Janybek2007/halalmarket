'use client';
import React, { Suspense } from 'react';
import { PurchasesQuery } from '~/entities/purchase';
import { State } from '~/shared/components/state/state.ui';
import { usePaginatedQuery } from '~/shared/libs/pagination';

import { OrderLI } from '~/entities/order';
import { Pagination } from '~/shared/components/pagination/pagination.ui';
import styles from './page.module.scss';

export default () => {
	return (
		<Suspense>
			<ProfileMyPurchasesPage />
		</Suspense>
	);
};

function ProfileMyPurchasesPage() {
	const {
		data,
		query: { isLoading },
		pagination
	} = usePaginatedQuery(PurchasesQuery.GetPurchasesQuery, {
		statuses: ['pending', 'shipped', 'cancellation_requested'],
		per_pages: 6
	});

	const finalPurcahes = React.useMemo(() => {
		if (!data) return [];
		return data.results.filter(p => p.items.length > 0);
	}, [data]);

	if (isLoading)
		return (
			<State
				icon='line-md:loading-alt-loop'
				title='Загрузка...'
				text='Пожалуйста, подождите'
			/>
		);

	return (
		<div className={styles.ordersPage}>
			<div className={`${styles.container} container`}>
				<div className={styles.header}>
					<h1 className={styles.title}>Статус текущих заказов</h1>
				</div>
				<div className={styles.content}>
					<div className={styles.listContainer}>
						{finalPurcahes.length === 0 ? (
							<State
								title='Статус текущих заказов'
								text='Ваш список заказов пуст'
							/>
						) : (
							finalPurcahes.map((purchase, i) => {
								const isMoreThenOne = purchase.items.length > 1;
								return (
									<OrderLI
										key={`Order-${purchase.user.full_name}-${i}`}
										isMoreThenOne={isMoreThenOne}
										with_role='user'
										order={purchase}
									/>
								);
							})
						)}
					</div>
					{(data?.count || 0) > 6 && (
						<Pagination className={styles.pagination} {...pagination} />
					)}
				</div>
			</div>
		</div>
	);
}
