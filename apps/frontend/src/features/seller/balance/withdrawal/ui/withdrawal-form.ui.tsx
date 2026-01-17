import React from 'react';
import { useWithdrawalMutation } from '../withdrawal-mutation';
import s from './styles.module.scss';

export const WithdrawalForm: React.FC<{ availableBalance: number }> =
	React.memo(({ availableBalance }) => {
		const { amount, handleSubmit, setAmount, isPending } =
			useWithdrawalMutation(availableBalance);

		return (
			<div className={s.withdrawalForm}>
				<h3>Вывод средств</h3>
				<form onSubmit={handleSubmit}>
					<div className={s.inputGroup}>
						<input
							type='number'
							value={amount}
							onChange={e => setAmount(e.target.value)}
							placeholder='Сумма для вывода'
							max={availableBalance}
							min={0}
							step='0.01'
							disabled={availableBalance <= 0}
						/>
						<span className={s.currency}>сом</span>
					</div>
					<button
						type='submit'
						disabled={isPending || availableBalance <= 0}
						className={s.submitBtn}
					>
						{isPending ? 'Отправка...' : 'Запросить вывод'}
					</button>
				</form>
				{availableBalance <= 0 && (
					<p className={s.noFunds}>Нет доступных средств для вывода</p>
				)}
			</div>
		);
	});

WithdrawalForm.displayName = 'WithdrawalForm';
