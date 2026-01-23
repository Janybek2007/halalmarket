import {
	type DefaultError,
	type OmitKeyof,
	type QueryKey,
	type UseQueryOptions,
	type UseQueryResult
} from '@tanstack/react-query';

import { useSession } from '~/app/providers/session';
import { useKeepQuery } from '../tanstack';
import { usePage } from './use-page';
import { usePagination, type UsePaginationReturn } from './use-pagination';

interface UsePaginatedQueryParams {
	per_pages?: number;
	scrollInHandle?: boolean;
}

type UsePaginatedQuery = <
	TQueryFnData = unknown,
	TError = DefaultError,
	TData = TQueryFnData,
	TQueryKey extends QueryKey = QueryKey,
	TParams = object & UsePaginatedQueryParams
>(
	query: (
		params: TParams
	) => OmitKeyof<
		UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
		'queryFn'
	>,
	options: UsePaginatedQueryParams & TParams
) => {
	query: OmitKeyof<UseQueryResult<TData, TError>, 'data'>;
	pagination: UsePaginationReturn;
	data: TData | undefined;
};

export const usePaginatedQuery: UsePaginatedQuery = (query, params) => {
	const pData = usePage({ per_pages: params.per_pages || 3 });

	const { data, ...queryData } = useKeepQuery(
		query({
			...params,
			per_pages: pData.per_pages,
			page: pData.page,
		})
	);
	const pagination = usePagination({
		...pData,
		total: (data as { count: number })?.count || 0,
		scrollInHandle: params.scrollInHandle,
	});

	return {
		query: queryData,
		pagination,
		data
	};
};
