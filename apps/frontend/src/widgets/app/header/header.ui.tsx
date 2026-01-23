'use client';
import clsx from 'clsx';
import React from 'react';

import { useToggle } from '~/shared/hooks/use-toggle';

import Link from 'next/link';
import { useNotifications } from '~/app/providers/notifications';
import { useSession } from '~/app/providers/session';
import { useCart } from '~/entities/cart';
import { LogoutBtn } from '~/features/auth/logout';
import { ChangePassword } from '~/features/user/change-password';
import { UpdateProfileDrawer } from '~/features/user/update';
import { Assets } from '~/shared/assets';
import { RoutePaths } from '~/shared/router';
import { Avatar } from '~/shared/ui/avatar/avatar.ui';
import { Dropdown } from '~/shared/ui/dropdown/dropdown.ui';
import { Icon } from '~/shared/ui/icon/icon.ui';
import s from './styles.module.scss';

const AppHeader: React.FC = () => {
	const [open, { toggle }] = useToggle();
	const [isChangePassword, { toggle: toggleChangePassword }] = useToggle();
	const { user: profile } = useSession();
	const totalCarts = useCart(false)?.totalCount || 0;
	const n = useNotifications(false) ?? {
		unreadCount: 0,
		toggleDrawer: () => {}
	};

	return (
		<>
			{open && <UpdateProfileDrawer onClose={toggle} />}
			{isChangePassword && <ChangePassword onClose={toggleChangePassword} />}
			<header className={s.header}>
				<div className={`${s.container} container`}>
					<div className={s.logo}>
						<Link
							href={
								profile?.role === 'seller'
									? RoutePaths.Seller.Products
									: RoutePaths.Guest.Home
							}
						>
							HALAL
						</Link>
					</div>
					<div className={s.actions}>
						{profile ? (
							<>
								{['seller', 'admin'].includes(profile.role) && (
									<button
										onClick={n?.toggleDrawer}
										className={s.notificationButton}
									>
										<Icon name='line-md:bell-loop' />
										{n && n.unreadCount > 0 && (
											<span className={'flexCenter'}>{n.unreadCount}</span>
										)}
									</button>
								)}
								{['admin'].includes(profile.role) && (
									<Link
										prefetch={false}
										href={RoutePaths.Admin.Products}
										className={s.avatarLink}
									>
										<Avatar
											src={profile.avatar}
											alt='profile'
											mediaOpts={{ h: 33.6, w: 33.6 }}
											className={s.avatar}
											placeholder={profile.full_name[0]}
											media
										/>
										<div className={s.col}>
											<span>{profile?.full_name}</span>
											<span title={profile?.email} className={s.email}>
												{profile?.email}
											</span>
										</div>
									</Link>
								)}
								{['seller'].includes(profile.role) && (
									<Dropdown
										trigger={({ toggle, isOpen }) => (
											<button onClick={toggle} className={s.avatarLink}>
												<Avatar
													src={profile.avatar}
													alt='profile'
													className={s.avatar}
													mediaOpts={{ h: 33.6, w: 33.6 }}
													placeholder={profile.full_name[0]}
													media
												/>
												<div className={s.col}>
													<span>{profile?.full_name}</span>
													<span title={profile?.email} className={s.email}>
														{profile?.email}
													</span>
												</div>
												<Icon
													className={clsx(s.icon, isOpen && s.open)}
													name='line-md:chevron-down'
												/>
											</button>
										)}
										className={s.dd}
										options={[
											{
												label: <>Изменить пароль</>,
												onClick: toggleChangePassword
											},
											{
												label: <>Редактировать </>,
												onClick: toggle
											},
											{
												label: <LogoutBtn as='span' />
											}
										]}
									/>
								)}

								{['user'].includes(profile.role) && (
									<Link
										prefetch={false}
										href={RoutePaths.User.Profile}
										className={s.iconLink}
									>
										<Avatar
											src={profile.avatar}
											alt='profile'
											className={s.avatar}
											mediaOpts={{ h: 33.6, w: 33.6 }}
											placeholder={profile.full_name[0]}
											media
										/>
										<span>Мой профиль</span>
									</Link>
								)}

								{!['seller', 'admin'].includes(profile.role) && (
									<Link
										prefetch={false}
										href={RoutePaths.User.Cart}
										className={clsx(s.iconLink, s.cartLink)}
									>
										<img src={Assets.CartWhiteSvg} alt='cart' />
										<span>Корзина</span>
										{totalCarts > 0 && (
											<span className={s.cartCount}>{totalCarts}</span>
										)}
									</Link>
								)}
							</>
						) : (
							<>
								<Link href={RoutePaths.Seller.Request} className={s.sellerLink}>
									Стать продавцом
								</Link>
								<Link href={RoutePaths.Auth.Login} className={s.loginButton}>
									Войти
								</Link>
							</>
						)}
					</div>
				</div>
			</header>
		</>
	);
};

export default function AppHeaderWrapper() {
	return (
		<div className={s.headerWrapper}>
			<AppHeader />
		</div>
	);
}
