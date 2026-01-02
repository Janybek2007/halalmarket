import React from 'react';

import { useSize } from '~/shared/hooks/use-size';

import { ProductListItem } from '~/entities/products';
import { IPurchaseResult } from '~/entities/purchase';
import { OrderUpdateStatus } from '~/features/order/update-status';
import { PurchaseUpdateStatus } from '~/features/purchase/update-status';
import { RoutePaths } from '~/shared/router';
import { DropdownOption } from '~/shared/ui/dropdown/dropdown.types';
import { formatDateCustom } from '~/shared/utils/date';
import { getOrderStatus } from '~/shared/utils/get-status';
import { priceFormat } from '~/shared/utils/price';
import styles from './styles.module.scss';

interface IOrderLIProps {
	order: IPurchaseResult;
	isMoreThenOne?: boolean;
	with_role?: 'seller' | 'user';
	isActions?: boolean;
	linkEnable?: boolean;
}

export const OrderLI: React.FC<IOrderLIProps> = ({
	order,
	isMoreThenOne,
	with_role,
	isActions = true
}) => {
	const size = useSize();
	const StatusBadgeRowCm = (
		<>
			<div className={styles.row}>
				<div className={styles.orderLabel}>Статус:</div>
				<div data-cn='statusBadge' data-status={order.status}>
					<svg
						className={styles.checkIcon}
						width='16'
						height='16'
						viewBox='0 0 16 16'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path
							d='M6.66675 10.7834L12.1918 5.25841L13.0168 6.08341L6.66675 12.4334L2.98341 8.75008L3.80841 7.92508L6.66675 10.7834Z'
							fill='white'
						/>
					</svg>
					{getOrderStatus(order.status)}
				</div>
			</div>
			{isActions && (
				<>
					{with_role === 'user' && (
						<div className={styles.row}>
							<div className={styles.orderLabel}>Действия:</div>
							<PurchaseUpdateStatus status={order.status} id={order.id} />
						</div>
					)}
					{with_role === 'seller' && order.status === 'processing' && (
						<div className={styles.row}>
							<div className={styles.orderLabel}>Действия:</div>
							<OrderUpdateStatus id={order.id} />
						</div>
					)}
				</>
			)}
		</>
	);
	return (
		<ProductListItem
			className={styles.orderLI}
			date={
				!isMoreThenOne && size.width >= 560
					? `${formatDateCustom(order.created_at, 'yyyy-MM-dd')}г`
					: undefined
			}
			products={order.orders.map(order => ({
				...order.product,
				quantity: order.quantity
			}))}
			linkEnable={with_role !== 'seller'}
			options={
				[
					with_role !== 'seller' && {
						label: (
							<>
								<span data-center data-primary>
									Подробнее
								</span>
							</>
						),
						to: RoutePaths.User.OrderDetail(order.id)
					}
				].filter(Boolean) as DropdownOption[]
			}
			extra={
				<>
					{with_role === 'seller' && <div></div>}

					{(isMoreThenOne || size.width <= 560) && (
						<div className={`${styles.col} ${styles.orderInfo}`}>
							{with_role === 'seller' && (
								<>
									<span className={styles.orderLabel}>
										Покупатель: {order.user.full_name}
									</span>
									<span className={styles.orderLabel}>
										Номер телефона: {order.user.phone}
									</span>
									{order.delivery_date && (
										<span className={styles.orderLabel}>
											Дата доставки:{' '}
											{formatDateCustom(order.delivery_date, 'yyyy-MM-dd')}
										</span>
									)}
								</>
							)}
							<span className={styles.orderLabel}>
								Общая сумма: <strong>{priceFormat(order.total_price)}</strong>
							</span>
							{with_role === 'user' && (
								<span className={styles.orderLabel}>
									Дата покупки:{' '}
									{formatDateCustom(order.created_at, 'yyyy-MM-dd')}
								</span>
							)}
							{StatusBadgeRowCm}
						</div>
					)}
				</>
			}
		>
			{product => (
				<>
					<div className={styles.orderStatus}>
						<div className={styles.orderInfo}>
							<div className={styles.orderLabel}>Количество:</div>
							<div className={styles.orderValue}>{product.quantity}шт</div>
						</div>

						{!isMoreThenOne && size.width >= 560 && StatusBadgeRowCm}
					</div>
				</>
			)}
		</ProductListItem>
	);
};
