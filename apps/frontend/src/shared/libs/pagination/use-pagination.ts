'use client';
import React from 'react';

import type { UsePageReturn } from './use-page';

interface UsePaginationArg extends UsePageReturn {
	total: number | undefined;
	scrollInHandle?: boolean;
}

export interface UsePaginationReturn {
	page: number;
	pageNumbers: (string | number)[];
	disabled: Record<'next' | 'prev', boolean>;
	HandleNext: VoidFunction;
	HandlePrev: VoidFunction;
	ToPage: (page: number | string) => void;
}
type UsePaginationType = (arg: UsePaginationArg) => UsePaginationReturn;

export const usePagination: UsePaginationType = ({
	page,
	per_pages,
	setPage,
	total,
	scrollInHandle = true
}) => {
	const itemsCount = React.useMemo(
		() => Math.ceil((total ?? 1) / per_pages),
		[total, per_pages]
	);

	React.useEffect(() => {
		if (!scrollInHandle) return;
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}, [page, scrollInHandle]);

	const pageNumbers = React.useMemo(() => {
		const currentPage = page ?? 1;
		const pages = [];

		pages.push(1);

		let startPage = Math.max(2, currentPage - 1);
		let endPage = Math.min(itemsCount - 1, currentPage + 1);

		if (currentPage <= 3) {
			endPage = Math.min(4, itemsCount - 1);
		} else if (currentPage >= itemsCount - 2) {
			startPage = Math.max(2, itemsCount - 3);
		}

		if (startPage > 2) {
			pages.push('...');
		}

		for (let i = startPage; i <= endPage; i++) {
			pages.push(i);
		}

		if (endPage < itemsCount - 1) {
			pages.push('...');
		}

		if (itemsCount > 1) {
			pages.push(itemsCount);
		}

		return pages;
	}, [page, itemsCount]);

	const HandleNext = React.useCallback(() => {
		setPage(page => (page ? (page === itemsCount ? page : page + 1) : 1));
	}, [setPage, itemsCount]);

	const HandlePrev = React.useCallback(() => {
		setPage(page => (page ? (page === 1 ? page : page - 1) : 1));
	}, [setPage]);

	const ToPage = React.useCallback(
		(page: number | string) => {
			setPage(Number(page));
		},
		[setPage]
	);

	const isPrevDisabled = (page ?? 1) <= 1;
	const isNextDisabled = (page ?? 1) >= itemsCount;

	return {
		HandleNext,
		HandlePrev,
		ToPage,
		page: page,
		pageNumbers,
		disabled: {
			next: isNextDisabled,
			prev: isPrevDisabled
		}
	};
};
