'use client';
import clsx from 'clsx';
import React from 'react';

import Link from 'next/link';
import { useSession } from '~/app/providers/session';
import { Assets } from '~/shared/assets';
import { RoutePaths } from '~/shared/router';
import s from './styles.module.scss';

const toProfile = {
	seller: RoutePaths.Seller.Products,
	admin: RoutePaths.Admin.Products,
	user: RoutePaths.User.Profile,
	guest: RoutePaths.Guest.Home
};

const AppTabs = React.memo(() => {
	const { user: profile } = useSession();

	const items = React.useMemo(
		() => [
			{
				label: 'Меню',
				href: RoutePaths.Guest.Categories,
				img: Assets.BurgerMenuSvg
			},
			{ label: 'Главный', href: RoutePaths.Guest.Home, img: Assets.HomeSvg },
			{
				label: 'Профиль',
				href: toProfile[profile?.role || 'guest'],
				img: Assets.ProfileSvg
			}
		],
		[profile?.role]
	);

	return (
		<div id='app-tabs' className={clsx(s.tabs)}>
			{items.map((v, i) => (
				<Link key={`${v.href}-${i}-key`} className={s.tab} href={v.href}>
					<img src={v.img} alt={v.label} />
					<span>{v.label}</span>
				</Link>
			))}
		</div>
	);
});

AppTabs.displayName = 'AppTabs';

export default function ApptabsWrapper() {
	return (
		<div className={s.tabsWrapper}>
			<AppTabs />
		</div>
	);
}
