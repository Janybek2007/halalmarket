import clsx from 'clsx';
import React from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNotifications } from '~/app/providers/notifications';
import { useSession } from '~/app/providers/session';
import { ChangePassword } from '~/features/user/change-password';
import { UpdateProfileDrawer } from '~/features/user/update';
import { useToggle } from '~/shared/hooks';
import { Avatar } from '~/shared/ui/avatar/avatar.ui';
import { Icon } from '~/shared/ui/icon/icon.ui';
import { menuItems } from '../constants';
import s from './styles.module.scss';

const Sidebar: React.FC = () => {
	const [open, { toggle }] = useToggle();
	const [isChangePassword, { toggle: toggleChangePassword }] = useToggle();

	const pathname = usePathname();
	const { user: profile } = useSession();
	const n = useNotifications(false) ?? {
		toggleDrawer: () => {},
		unreadCount: 0
	};

	return (
		<>
			{isChangePassword && <ChangePassword onClose={toggleChangePassword} />}
			{open && <UpdateProfileDrawer onClose={toggle} />}
			<aside className={s.sidebar}>
				<div className={s['logo-wrapper']}>
					<div className={s.logo}>
						<span className={s.halalText}>HALAL</span>
					</div>
				</div>

				<div className={s.userInfo}>
					{profile && (
						<Avatar
							src={profile.avatar}
							alt='profile'
							className={s.avatar}
							placeholder={profile.full_name[0]}
							media
						/>
					)}
					<button onClick={n?.toggleDrawer} className={s.notification}>
						<Icon name='line-md:bell-loop' c_size={24} />
						{n && n.unreadCount > 0 && (
							<span className={'flexCenter'}>{n.unreadCount}</span>
						)}
					</button>
				</div>

				<nav className={s.navigation}>
					<ul className={s.menuList}>
						{menuItems.slice(0, -3).map(v => (
							<li
								key={v.path}
								className={clsx(pathname === v.path && s.active, s.menuItem)}
							>
								<Link href={v.path} className={s.menuLink}>
									{v.icon ? (
										<Icon name={v.icon} c_size={24} />
									) : (
										<img src={v.img} alt={v.name} />
									)}
									<span>{v.name}</span>
								</Link>
							</li>
						))}
					</ul>
				</nav>

				<div className={s.bottomMenu}>
					<ul className={s.menuList}>
						{menuItems.slice(-3).map((v, i) =>
							v.action ? (
								<li
									key={`${v.path}-${i}-li-key`}
									className={clsx(pathname === v.path && s.active, s.menuItem)}
								>
									<button
										type='button'
										className={s.menuLink}
										onClick={() => {
											if (v.action == 'change-password') {
												toggleChangePassword();
											} else if (v.action === 'view-profile') {
												toggle();
											}
										}}
									>
										<img src={v.img} alt={v.name} />
										<span>{v.name}</span>
									</button>
								</li>
							) : (
								<li
									key={v.path}
									className={clsx(pathname === v.path && s.active, s.menuItem)}
								>
									<Link href={v.path} className={s.menuLink}>
										<img src={v.img} alt={v.name} />
										<span>{v.name}</span>
									</Link>
								</li>
							)
						)}
					</ul>
				</div>
			</aside>
		</>
	);
};

export default Sidebar;
