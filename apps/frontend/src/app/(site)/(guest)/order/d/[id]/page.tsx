'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { OrderQuery } from '~/entities/order';
import { State } from '~/shared/components/state/state.ui';
import { formatDateCustom } from '~/shared/utils/date';
import { getOrderStatus } from '~/shared/utils/get-status';
import { priceFormat } from '~/shared/utils/price';
import s from './page.module.scss';

export default function GuestOrderDetail() {
	const params = useParams<{ id: string }>();
	const orderId = +params.id;
	const { data: order, isLoading } = useQuery(
		OrderQuery.GetOrderQuery({ id: orderId })
	);

	if (isLoading)
		return (
			<State
				icon='line-md:loading-alt-loop'
				title='Загрузка...'
				text='Пожалуйста, подождите'
			/>
		);
	if (!order)
		return (
			<State
				title='Заказ не найден'
				text='К сожалению, заказ с таким идентификатором не существует. Попробуйте вернуться к каталогу или воспользуйтесь поиском.'
			/>
		);

	return (
		<main>
			<div className={s.orderDetailPage}>
				<div className={`${s.container} container`}>
					<div className={s.content}>
						<div className={s.receipt}>
							<h1 className={s.title}>Чек</h1>

							{/* <div className={s.info}>
								<span className={s.infoLabel}>Магазин:</span>
								<span className={s.infoValue}>MONA STYLE</span>
							</div> */}

							<div className={`${s.info} ${s.dateInfo}`}>
								<div className={s.dateRow}>
									<span className={s.dateLabel}>Статус: </span>
									<span
										className={`${s.dateValue} ${s.badge} ${s[order.status]}`}
									>
										{getOrderStatus(order.status)}
									</span>
								</div>
								<div className={s.dateRow}>
									<span className={s.dateLabel}>Дата создание: </span>
									<span className={s.dateValue}>
										{formatDateCustom(order?.created_at, 'yyyy-MM-dd')}{' '}
									</span>
								</div>
								{order.delivery_date && (
									<div className={s.dateRow}>
										<span className={s.dateLabel}>Дата доставки: </span>
										<span className={s.dateValue}>
											{formatDateCustom(order?.delivery_date, 'yyyy-MM-dd')}{' '}
										</span>
									</div>
								)}
								{order.delivery_address && (
									<div className={s.dateRow}>
										<span className={s.dateLabel}>Адресс доставки: </span>
										<span className={s.dateValue}>
											{order.delivery_address}
										</span>
									</div>
								)}
							</div>

							<div className={s.items}>
								{order.items.map(order => (
									<div key={order.id} className={s.item}>
										<span
											className={s.itemName}
											title={`${order.product.name} ${
												order.quantity > 1 ? `(${order.quantity}шт.)` : ''
											}`}
										>
											{order.product.name} ({order.quantity}шт)
										</span>
										<span className={s.itemPrice}>
											{priceFormat(order.total_price, 'сом')}{' '}
										</span>
									</div>
								))}
							</div>

							<div className={s.divider}></div>

							<div className={s.total}>
								<span>Итого: {priceFormat(order.total_price)}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
