import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			staleTime: 60 * 1000,
			gcTime: 5 * 60 * 1000,
			refetchOnReconnect: false,
			retry: 1
		},
		mutations: {
			retry: false
		}
	}
});
