'use client';
import { SellersQuery } from '~/entities/sellers';
import { useDatePicker } from '~/shared/hooks/use-date-picker';
import { usePaginatedQuery } from '~/shared/libs/pagination';

import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { DatePicker } from '~/shared/components/date-picker/date-picker.ui';
import { State } from '~/shared/components/state/state.ui';
import s from './page.module.scss';

const SellerPageHead = dynamic(() =>
	import('~/widgets/seller/seller-page-head/seller-page-head.ui').then(m => ({
		default: m.SellerPageHead
	}))
);

const Pagination = dynamic(() =>
	import('~/shared/components/pagination/pagination.ui').then(m => ({
		default: m.Pagination
	}))
);

const OrderLI = dynamic(() =>
	import('~/entities/order').then(m => ({
		default: m.OrderLI
	}))
);

export default function SellerOrdersPage() {
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
