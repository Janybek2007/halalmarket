'use client';

import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { SellersQuery } from '~/entities/sellers';
import { WithdrawalForm } from '~/features/seller/balance/withdrawal';
import { State } from '~/shared/components/state/state.ui';
import { priceFormat } from '~/shared/utils/price';
import s from './page.module.scss';

const SellerPageHead = dynamic(() =>
	import('~/widgets/seller/seller-page-head/seller-page-head.ui').then(m => ({
		default: m.SellerPageHead
	}))
);

export default function SellerBalancePage() {
	const { data: balance, isLoading } = useQuery(
		SellersQuery.GetSellerBalance()
	);

	const { data: withdrawals } = useQuery(SellersQuery.GetSellerWithdrawals());

	if (isLoading) {
		return (
			<State
				icon='line-md:loading-alt-loop'
				title='Загрузка...'
				text='Пожалуйста, подождите'
			/>
		);
	}

	return (
		<main className={s.main}>
			<SellerPageHead title='Баланс' />
			<div className='container'>
				<div className={s.balanceCards}>
					<div className={s.card}>
						<h3>Доступно для вывода</h3>
						<p className={s.amount}>
							{priceFormat(parseFloat(balance?.available_balance || '0'))}
						</p>
					</div>
					<div className={s.card}>
						<h3>В ожидании (Hold)</h3>
						<p className={s.amount}>
							{priceFormat(parseFloat(balance?.hold_balance || '0'))}
						</p>
						<small>Средства за незавершенные заказы</small>
					</div>
					<div className={s.card}>
						<h3>Общий баланс</h3>
						<p className={s.amount}>
							{priceFormat(parseFloat(balance?.total_balance || '0'))}
						</p>
					</div>
				</div>

				<WithdrawalForm
					availableBalance={parseFloat(balance?.available_balance || '0')}
				/>

				{withdrawals && withdrawals.length > 0 && (
					<div className={s.withdrawalsSection}>
						<h3>История запросов на вывод</h3>
						<div className={s.withdrawalsList}>
							{withdrawals.map(w => (
								<div key={w.id} className={s.withdrawalItem}>
									<div className={s.withdrawalInfo}>
										<span className={s.withdrawalAmount}>
											{priceFormat(parseFloat(w.amount))}
										</span>
										<span className={s.withdrawalDate}>
											{new Date(w.created_at).toLocaleDateString('ru-RU')}
										</span>
									</div>
									<span className={s.withdrawalStatus} data-status={w.status}>
										{w.status_display}
									</span>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</main>
	);
}
