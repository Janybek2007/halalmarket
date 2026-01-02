import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useNotifications } from '~/app/providers/notifications';
import { NotificationsQuery } from '~/entities/notifications';
import { http } from '~/shared/api/http';
import { queryClient } from '~/shared/libs/tanstack';

export const useMarkAsReadMutation = (markAll: boolean) => {
	const n = useNotifications();
	return useMutation({
		mutationKey: ['notifications-mark-read', markAll],
		mutationFn: async (body: { ids: number[] }) => {
			toast.promise(http.post('notifications/mark-read/', body), {
				loading: markAll
					? 'Отмечаем все как прочитанные...'
					: 'Отмечаем как прочитанное...',
				error: markAll
					? 'Не удалось отметить все уведомления как прочитанные'
					: 'Не удалось отметить уведомление как прочитанное',
				success: markAll
					? 'Все уведомления отмечены как прочитанные'
					: 'Уведомление отмечено как прочитанное'
			});
		},
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
