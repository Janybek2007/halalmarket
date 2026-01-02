'use client';
import clsx from 'clsx';
import React from 'react';

import { useSize } from '~/shared/hooks/use-size';
import { useToggle } from '~/shared/hooks/use-toggle';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from '~/app/providers/session';
import { LogoutBtn } from '~/features/auth/logout';
import { UpdateProfileDrawer } from '~/features/user/update';
import { Assets } from '~/shared/assets';
import { RoutePaths } from '~/shared/router';
import { Avatar } from '~/shared/ui/avatar/avatar.ui';
import { Button } from '~/shared/ui/button/button.ui';
import { Icon } from '~/shared/ui/icon/icon.ui';
import s from './styles.module.scss';

const Wrapper = React.memo<React.PropsWithChildren>(({ children }) => {
	const pathname = usePathname();
	if (!pathname.includes('profile')) {
		return;
	}
	return children;
});

Wrapper.displayName = '_Wrapper_';

export const ProfileHead: React.FC = React.memo(() => {
	const pathname = usePathname();
	const { user: profile } = useSession();
	const [open, { toggle }] = useToggle();
	const size = useSize();
	return (
		<Wrapper>
			{open && <UpdateProfileDrawer onClose={toggle} />}
			<div className={s.profileHead}>
				<div className={`${s.container} container`}>
					<h1 className={s.pageTitle}>Мой профиль</h1>

					<div className={s.profileCard}>
						<div className={s.profileInfo}>
							<div className={s.avatarContainer}>
								<Avatar
									src={profile?.avatar}
									placeholder={profile?.full_name[0]}
									alt='profile'
									className={s.avatar}
									media
								/>
							</div>
							<div className={s.userInfo}>
								<h2 className={s.userName}>{profile?.full_name}</h2>
								<div className={s.userRoleContainer}>
									<p className={s.userRole}>Пользователь</p>
									<LogoutBtn className={s.logoutBtn} />
								</div>
								<Button className={s.editButton} onClick={toggle}>
									<Icon name='mingcute:pencil-line' className={s.editIcon} />
									Редактировать профиль
								</Button>
							</div>
						</div>

						<div className={s.statsContainer}>
							<Link
								href={RoutePaths.User.Orders}
								className={clsx(
									s.statCard,
									pathname === RoutePaths.User.Orders && s.active
								)}
							>
								<h3 className={s.statTitle}>Мои покупки</h3>
								<div className={s.statValue}>0</div>
							</Link>

							<Link
								href={RoutePaths.User.MyPurchases}
								className={clsx(
									s.statCard,
									pathname === RoutePaths.User.MyPurchases && s.active
								)}
							>
								<h3 className={s.statTitle}>Статус текущих заказов</h3>
								<div className={s.statValue}>
									<img
										src={Assets.CarOutlineSvg}
										className={s.statIcon}
										alt='car-outline'
									/>
								</div>
							</Link>

							<Link
								href={RoutePaths.User.Favorites}
								className={clsx(
									s.statCard,
									pathname === RoutePaths.User.Favorites && s.active
								)}
							>
								<h3 className={s.statTitle}>Сохраненные</h3>
								<div className={s.statValue}>
									<Icon name='mdi:heart-outline' />
								</div>
							</Link>
							{size.width <= 899 && (
								<Link
									href={RoutePaths.User.Cart}
									className={clsx(
										s.statCard,
										pathname === RoutePaths.User.Cart && s.active
									)}
								>
									<h3 className={s.statTitle}>Корзина</h3>
									<div className={s.statValue}>
										<Icon name='mdi:cart-outline' className={s.statIcon} />
									</div>
								</Link>
							)}
						</div>
					</div>
				</div>
			</div>
		</Wrapper>
	);
});

ProfileHead.displayName = '_ProfileHead_';
