import { useMutation } from '@tanstack/react-query';
import { useNotifications } from '~/app/providers/notifications';
import { NotificationsQuery } from '~/entities/notifications';
import { http } from '~/shared/api/http';
import { queryClient } from '~/shared/libs/tanstack';

export const useDeleteNotificationsMutation = (deleteAll: boolean) => {
	const n = useNotifications();
	return useMutation({
		mutationKey: ['notifications-delete', deleteAll],
		mutationFn: async (body: { ids: number[] }) =>
			http.delete('notification/delete/', {
				body: {
					deleteAll,
					ids: body.ids.join(',')
				}
			}),
		onSuccess() {
			queryClient.refetchQueries({
				queryKey: NotificationsQuery.QueryKeys.GetNotifications({})
			});
			setTimeout(() => {
				n?.toggleDrawer();
			}, 300);
		}
	});
};
