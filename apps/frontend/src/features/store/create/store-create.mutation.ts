import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { IUser, USER_PROFILE_KEY } from '~/entities/user';
import { SuccessResponse } from '~/global';
import { http } from '~/shared/api/http';
import { queryClient } from '~/shared/libs/tanstack';
import { buildFormData } from '~/shared/utils/build-form-data';
import { StoreCreateDto, StoreCreateSchema } from './store-create.contract';

export const useStoreCreateMutation = (onClose: VoidFunction) => {
	const form = useForm<StoreCreateDto>({
		resolver: zodResolver(StoreCreateSchema),
		defaultValues: {
			store_name: '',
			is_read_policy: false
		}
	});

	const {
		mutateAsync,
		error: apiError,
		isPending
	} = useMutation({
		mutationKey: ['store-create'],
		mutationFn: (parsedBody: StoreCreateDto) =>
			http.post<SuccessResponse & { seller_data: IUser['seller'] }>(
				'store/create/',
				buildFormData(parsedBody)
			)
	});

	const onSubmit = React.useCallback(
		(data: StoreCreateDto) => {
			toast.promise(
				async () => {
					const r = await mutateAsync(data);
					if (r.success) {
						if (r.seller_data) {
							queryClient.setQueryData<IUser>(USER_PROFILE_KEY, prev => {
								return { ...prev, seller: r.seller_data } as IUser;
							});
						}
						toast.success('Магазин создан');
						setTimeout(() => {
							onClose();
						}, 500);
					}
				},
				{ loading: 'Создание...' }
			);
		},
		[onClose, mutateAsync]
	);
	return {
		onsubmit: form.handleSubmit(onSubmit),
		apiError,
		isPending,
		form
	};
};
