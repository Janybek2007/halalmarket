'use client';
import { SellersQuery } from '~/entities/sellers';
import { useDatePicker } from '~/shared/hooks/use-date-picker';
import { usePaginatedQuery } from '~/shared/libs/pagination';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { OrderLI } from '~/entities/order';
import { DatePicker } from '~/shared/components/date-picker/date-picker.ui';
import { Pagination } from '~/shared/components/pagination/pagination.ui';
import { State } from '~/shared/components/state/state.ui';
import { SellerPageHead } from '~/widgets/seller/seller-page-head/seller-page-head.ui';
import s from './page.module.scss';

export default () => {
	return (
		<Suspense>
			<SellerOrdersPage />
		</Suspense>
	);
};

function SellerOrdersPage() {
	const datePicker = useDatePicker();
	const sp = useSearchParams();

	const {
		data,
		query: { isLoading },
		pagination
	} = usePaginatedQuery(SellersQuery.GetOrdersQuery, {
		per_pages: 3,
		start_date: datePicker.startDate.value,
		end_date: datePicker.endDate.value,
		_to: sp.get('_to')
	});
	return (
		<main className={s.main}>
			<SellerPageHead
				title='Заказы'
				endEl={
					<h4>
						Количество заказов: <span>{data?.count}</span>
					</h4>
				}
			>
				<div className={s.datePicker}>
					<DatePicker {...datePicker} />
				</div>
			</SellerPageHead>
			<div className='container'>
				<div className={s.ordersList}>
					{isLoading ? (
						<State
							icon='line-md:loading-alt-loop'
							title='Загрузка...'
							text='Пожалуйста, подождите'
						/>
					) : Number(data?.count) === 0 ? (
						<State
							title='Нет заказов'
							text='Пока что нет заказов на ваши товары. Как только покупатели оставят отзывы, они появятся здесь.'
						/>
					) : (
						<>
							{data?.results.map((order, i) => {
								const isMoreThenOne = order.items.length > 1;

								return (
									<OrderLI
										key={`Order-${order.user.full_name}-${i}`}
										order={order}
										isMoreThenOne={isMoreThenOne}
										with_role='seller'
									/>
								);
							})}
							{(data?.count || 0) > 3 && <Pagination {...pagination} />}
						</>
					)}
				</div>
			</div>
		</main>
	);
}
