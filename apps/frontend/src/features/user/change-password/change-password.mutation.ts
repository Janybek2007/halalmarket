import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { SuccessResponse } from '~/global';
import { http } from '~/shared/api/http';
import {
	ChangePasswordDto,
	ChangePasswordSchema
} from './change-password.contract';

export const useChangePasswordMutation = (onClose: VoidFunction) => {
	const form = useForm<ChangePasswordDto>({
		resolver: zodResolver(ChangePasswordSchema)
	});
	const {
		mutateAsync: change,
		error: apiError,
		isPending
	} = useMutation({
		mutationKey: ['change-password_mutation'],
		mutationFn: (parsedBody: ChangePasswordDto) =>
			http.post<SuccessResponse>('user/change-password/', parsedBody)
	});
	const onSubmit = React.useCallback(
		async (data: ChangePasswordDto) => {
			toast.promise(
				async () => {
					await change(data);
					setTimeout(onClose, 500);
				},
				{
					loading: 'Изменение пароля...',
					success: 'Пароль успешно изменен!',
					error: 'Ошибка при изменении пароля'
				}
			);
		},
		[change, onClose]
	);
	return {
		onsubmit: form.handleSubmit(onSubmit),
		apiError,
		isPending,
		form
	};
};
