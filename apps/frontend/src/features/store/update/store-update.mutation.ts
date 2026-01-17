import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useSession } from '~/app/providers/session';
import { IUser, USER_PROFILE_KEY } from '~/entities/user';
import { SuccessResponse } from '~/global';
import { http } from '~/shared/api/http';
import { queryClient } from '~/shared/libs/tanstack';
import { buildFormData } from '~/shared/utils/build-form-data';
import { UpdateStoreDto, UpdateStoreSchema } from './store-update.contract';

export const useStoreUpdateMutation = () => {
	const { user } = useSession();
	const form = useForm<UpdateStoreDto>({
		resolver: zodResolver(UpdateStoreSchema),
		defaultValues: {
			store_name: user?.seller?.store_name || '',
			store_logo: null
		}
	});
	const {
		mutateAsync: updateStore,
		error: apiError,
		isPending
	} = useMutation({
		mutationKey: ['update-store'],
		mutationFn: (parsedBody: UpdateStoreDto) =>
			http.patch<SuccessResponse & { seller_data: IUser['seller'] }>(
				'store/',
				buildFormData(parsedBody)
			)
	});

	const handleLogoChange = React.useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (file) form.setValue('store_logo', file);
		},
		[]
	);

	const onSubmit = React.useCallback(
		(data: UpdateStoreDto) => {
			toast.promise(
				async () => {
					const r = await updateStore(data);
					if (r.success) {
						if (r.seller_data) {
							queryClient.setQueryData<IUser>(USER_PROFILE_KEY, prev => {
								return { ...prev, seller: r.seller_data } as IUser;
							});
						}
						toast.success('Магазин обновлен');
					}
				},
				{ loading: 'Обновление...' }
			);
		},
		[updateStore]
	);
	return {
		onsubmit: form.handleSubmit(onSubmit),
		apiError,
		isPending,
		form,
		handleLogoChange
	};
};
