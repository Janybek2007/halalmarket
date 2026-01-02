import React from 'react';
import { toast } from 'sonner';
import { useDeleteNotificationsMutation } from './notification-delete.mutation';

interface DeleteNotificationButtonProps {
	ids?: number[];
	deleteAll?: boolean;
	className: string;
}

export const DeleteNotification: React.FC<DeleteNotificationButtonProps> =
	React.memo(({ ids = [], deleteAll = false, className }) => {
		const { mutateAsync: handleDelete, isPending: isDeleting } =
			useDeleteNotificationsMutation(deleteAll);

		const handleClick = React.useCallback(
			async (e: React.MouseEvent<HTMLButtonElement>) => {
				e.stopPropagation();

				toast.promise(handleDelete({ ids }), {
					loading: deleteAll
						? 'Удаляем все уведомления...'
						: 'Удаляем уведомление...',
					error: deleteAll
						? 'Не удалось удалить все уведомления'
						: 'Не удалось удалить уведомление',
					success: deleteAll ? 'Все уведомления удалены' : 'Уведомление удалено'
				});
			},
			[ids, deleteAll, handleDelete]
		);

		return (
			<button
				data-link={String(deleteAll)}
				type='button'
				className={className}
				onClick={handleClick}
				disabled={isDeleting}
			>
				{isDeleting ? 'Удаляем...' : deleteAll ? 'Удалить все' : 'Удалить'}
			</button>
		);
	});

DeleteNotification.displayName = 'DeleteNotification';
