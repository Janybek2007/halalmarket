import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';
import { SuccessResponse } from '~/global';
import { http } from '~/shared/api/http';
import { TIds } from '~/shared/api/types';

export const useSellersUpdateStatusMutation = (
	selectedIds: string[],
	callback: VoidFunction
) => {
	const { mutateAsync } = useMutation({
		mutationKey: ['sellers-update-status', selectedIds],
		mutationFn: (body: { status: 'active' | 'blocked' } & TIds) => {
			return http.patch<
				SuccessResponse & {
					updated_count: number;
				}
			>('sellers/update-status/', body);
		}
	});

	const handleUpdateStatus = React.useCallback(
		(status: 'active' | 'blocked' = 'active') => {
			toast.promise(
				async () => {
					const r = await mutateAsync({
						status,
						ids: selectedIds.map(v => +v)
					});
					if (r?.success) {
						if (status === 'active') {
							toast.success(`Активировано ${r?.updated_count} продавцов`);
						} else if (status === 'blocked') {
							toast.success(`Заблокировано ${r?.updated_count} продавцов`);
						}
						callback();
					}
				},
				{
					loading: 'Обновление статуса',
					error: 'Ошибка при обновление продавцов'
				}
			);
		},
		[mutateAsync, callback, selectedIds]
	);
	return { handleUpdateStatus };
};
