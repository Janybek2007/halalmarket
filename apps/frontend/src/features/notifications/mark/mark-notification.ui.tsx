import React from 'react';
import { useMarkAsReadMutation } from './mark-notification.mutation';

interface MarkNotificationProps {
	ids?: number[];
	className: string;
	markAll?: boolean;
}

export const MarkNotification: React.FC<MarkNotificationProps> = React.memo(
	({ ids = [], className, markAll = false }) => {
		const { mutateAsync: handleMarkAsRead, isPending: isMarkingAsRead } =
			useMarkAsReadMutation(markAll);

		const handleClick = React.useCallback(
			async (e: React.MouseEvent<HTMLButtonElement>) => {
				e.stopPropagation();

				handleMarkAsRead({
					ids
				});
			},
			[ids, markAll, handleMarkAsRead]
		);

		const buttonText = isMarkingAsRead
			? markAll
				? 'Отмечаем все...'
				: 'Отмечаем...'
			: markAll
			? 'Отметить все как прочитанные'
			: 'Отметить как прочитанное';

		const isDisabled =
			isMarkingAsRead || (markAll && (!ids || ids.length === 0));

		return (
			<button
				type='button'
				className={className}
				onClick={handleClick}
				disabled={isDisabled}
				{...(markAll && { 'data-link': true })}
			>
				{buttonText}
			</button>
		);
	}
);

MarkNotification.displayName = 'MarkNotification';
