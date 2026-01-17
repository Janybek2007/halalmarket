import { useMutation } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { SuccessResponse } from '~/global';
import { http } from '~/shared/api/http';
import { queryClient } from '~/shared/libs/tanstack';

export const useWithdrawalMutation = (availableBalance: number) => {
	const [amount, setAmount] = useState('');

	const { mutateAsync, isPending } = useMutation({
		mutationKey: ['create-withdrawal'],
		mutationFn: (data: { amount: number }) =>
			http.post<SuccessResponse>('seller/withdrawal/create/', data)
	});

	const handleSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();

			const numAmount = parseFloat(amount);
			if (isNaN(numAmount) || numAmount <= 0) {
				toast.error('Введите корректную сумму');
				return;
			}

			if (numAmount > availableBalance) {
				toast.error('Недостаточно средств');
				return;
			}

			try {
				const result = await mutateAsync({ amount: numAmount });
				if (result.success) {
					toast.success('Запрос на вывод создан');
					setAmount('');
					queryClient.refetchQueries({ queryKey: ['seller-balance'] });
					queryClient.refetchQueries({ queryKey: ['seller-withdrawals'] });
				}
			} catch (error) {
				toast.error('Ошибка при создании запроса');
			}
		},
		[amount, availableBalance]
	);
	return {
		handleSubmit,
		amount,
		setAmount,
		isPending
	};
};
