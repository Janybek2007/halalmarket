import React from 'react';

import { useClickAway } from '~/shared/hooks/use-click-away';

import Link from 'next/link';
import { useNotifications } from '~/app/providers/notifications';
import { DeleteNotification } from '~/features/notifications/delete';
import { MarkNotification } from '~/features/notifications/mark';
import { Icon } from '~/shared/ui/icon/icon.ui';
import { formatDateCustom } from '~/shared/utils/date';
import s from './styles.module.scss';

const NotificationDrawer: React.FC = React.memo(() => {
	const n = useNotifications();
	const containerRef = useClickAway<HTMLDivElement>(() => n?.toggleDrawer());

	return (
		<div className={s.drawer}>
			<div
				ref={containerRef}
				className={s.container}
				onClick={e => e.stopPropagation()}
				role='button'
				tabIndex={0}
				onKeyDown={e => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.stopPropagation();
					}
				}}
			>
				<div className={s.header}>
					<h2>Уведомления</h2>
					<button className={s.closeButton} onClick={n?.toggleDrawer}>
						<Icon name='line-md:close' c_size={20} />
					</button>
				</div>

				<div className={s.content}>
					{n && (!n.notifications || n.notifications.results.length === 0) ? (
						<div className={s.emptyState}>
							<div>
								<Icon name='line-md:bell' c_size={48} />
							</div>
							<p>У вас нет уведомлений</p>
						</div>
					) : (
						<ul className={s.notificationList}>
							{n &&
								n.notifications?.results.map(notification => {
									const data = notification.data as { link?: string };

									return (
										<li
											key={notification.id}
											className={`${s.notification} ${
												!notification.is_read ? s.unread : ''
											}`}
										>
											<Link
												href={data.link || '#'}
												prefetch={false}
												onClick={e => {
													e.stopPropagation();
													n?.toggleDrawer();
												}}
											>
												<h3 className={s.notificationTitle}>
													{notification.title}
												</h3>
												<p className={s.notificationMessage}>
													{notification.message}
												</p>
												<span className={s.notificationTime}>
													{formatDateCustom(
														new Date(notification.created_at),
														'dd.MM.yyyy HH:mm'
													)}
												</span>
											</Link>
											<div className={s.notificationActions}>
												{!notification.is_read && (
													<MarkNotification
														className={s.actionButton}
														ids={[notification.id]}
													/>
												)}

												<DeleteNotification
													ids={[notification.id]}
													className={`${s.actionButton} ${s.delete}`}
												/>
											</div>
										</li>
									);
								})}
						</ul>
					)}
				</div>

				{n && n.notifications && n.notifications.results.length > 0 && (
					<div className={s.footer}>
						<MarkNotification
							markAll
							ids={n.notifications.results.map(n => n.id)}
							className={s.actionButton}
						></MarkNotification>
						<DeleteNotification
							className={`${s.actionButton} ${s.delete}`}
							deleteAll
						/>
					</div>
				)}
			</div>
		</div>
	);
});
NotificationDrawer.displayName = 'NotificationDrawer';

export default NotificationDrawer
