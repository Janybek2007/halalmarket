'use client';

import { PurchasesQuery } from '~/entities/purchase';
import { State } from '~/shared/components/state/state.ui';
import { usePaginatedQuery } from '~/shared/libs/pagination';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { OrderLI } from '~/entities/order';
import { Pagination } from '~/shared/components/pagination/pagination.ui';
import styles from './page.module.scss';

export default () => {
	return (
		<Suspense>
			<ProfileOrdersPage />
		</Suspense>
	);
};

function ProfileOrdersPage() {
	const sp = useSearchParams();
	const {
		data,
		query: { isLoading },
		pagination
	} = usePaginatedQuery(PurchasesQuery.GetPurchasesQuery, {
		per_pages: 6,
		statuses: ['delivered', 'cancelled'],
		_to: Number(sp.get('_to'))
	});

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
					<h1 className={styles.title}>Мои покупки</h1>
				</div>
				<div className={styles.content}>
					<div className={styles.listContainer}>
						{data?.count === 0 ? (
							<State title='Мои покупки' text='Ваш список покупок пуст' />
						) : (
							data?.results.map((order, i) => {
								const isMoreThenOne = order.orders.length > 1;

								return (
									<OrderLI
										key={`Order-${order.user.full_name}-${i}`}
										isMoreThenOne={isMoreThenOne}
										isActions={false}
										with_role='user'
										order={order}
									/>
								);
							})
						)}
						{(data?.count || 0) > 6 && (
							<Pagination className={styles.pagination} {...pagination} />
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
