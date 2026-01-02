import React from 'react';
import { AppHeader } from '~/widgets/app/header';
import { AppTabs } from '~/widgets/app/tabs';
import { ProfileHead } from '~/widgets/profile-head/profile-head.ui';

export default function UserLayout(props: React.PropsWithChildren) {
	return (
		<>
			<AppHeader />
			<ProfileHead />
			{props.children}
			<AppTabs />
		</>
	);
}
