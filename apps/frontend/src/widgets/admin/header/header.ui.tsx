'use client';

import React from 'react';

import { usePathname } from 'next/navigation';
import { LogoutBtn } from '~/features/auth/logout';
import { menuItems } from '../constants';
import s from './styles.module.scss';

const Header: React.FC = React.memo(() => {
	const pathname = usePathname();
	return (
		<header id='admin-header' className={s.header}>
			<div className={s.container}>
				<h4>{menuItems.find(v => v.path === pathname)?.name}</h4>
				<LogoutBtn />
			</div>
		</header>
	);
});

Header.displayName = 'Header';

export default Header;
