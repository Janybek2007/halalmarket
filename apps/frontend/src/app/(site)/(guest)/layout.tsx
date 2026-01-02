import React from 'react';
import { AppHeader } from '~/widgets/app/header';
import { AppTabs } from '~/widgets/app/tabs';
import { SearchBar } from '~/widgets/search-bar';

export default async (props: React.PropsWithChildren) => {
	return (
		<>
			<AppHeader />
			<SearchBar />
			{props.children}
			<AppTabs />
			{/* <AppFooter /> */}
		</>
	);
};
