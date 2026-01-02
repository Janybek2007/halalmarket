import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import { queryClient } from '~/shared/libs/tanstack';

export const ReactQueryProvider: React.FC<React.PropsWithChildren> = ({
	children
}) => {
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};
