'use client';

import React from 'react';
import { Header } from '~/widgets/admin/header';
import { Sidebar } from '~/widgets/admin/sidebar';

import s from './layout.module.scss';

export default function AdminLayout(props: React.PropsWithChildren) {
	return (
		<div className={s.layout}>
			<Sidebar />
			<div className={s.content}>
				<Header />
				{props.children}
			</div>
		</div>
	);
}
