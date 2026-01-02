'use client';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import Link from 'next/link';
import { ProductService } from '~/entities/products';
import { useClickAway, useTimeDebounce } from '~/shared/hooks';
import { RoutePaths } from '~/shared/router';
import { Icon } from '~/shared/ui/icon/icon.ui';
import { Input } from '~/shared/ui/input/input.ui';
import s from './styles.module.scss';

export const ProductSearch: React.FC<{ className?: string }> = React.memo(
	({ className }) => {
		const [searchQuery, setSearchQuery] = React.useState('');
		const [debouncedQuery, setDebouncedQuery] = React.useState('');

		const debounceSearch = useTimeDebounce((value: string) => {
			setDebouncedQuery(value);
		}, 300);

		const { data: searched, isLoading } = useQuery({
			queryKey: ['product-search', debouncedQuery],
			queryFn: () => ProductService.GetSearchProduct({ q: debouncedQuery }),
			enabled: debouncedQuery.trim() !== ''
		});

		const clear = React.useCallback(() => {
			setSearchQuery('');
			setDebouncedQuery('');
		}, []);

		const containerRef = useClickAway<HTMLDivElement>(clear);

		return (
			<>
				<Input
					type='text'
					placeholder='Поиск товаров...'
					variant='outlined'
					value={searchQuery}
					onChange={e => {
						setSearchQuery(e.target.value);
						debounceSearch(e.target.value);
					}}
					className={className || s.searchInput}
					startIcon={isLoading ? 'lucide:loader' : 'mingcute:search-line'}
				/>
				{searched && searched?.count > 0 && (
					<div className={s.productList} ref={containerRef}>
						{searched.results.map(v => (
							<Link
								href={RoutePaths.Guest.ProductDetail(v.slug)}
								key={v.slug}
								onClick={clear}
								className={s.productItem}
							>
								<Icon name='cuida:search-outline' />
								<span>{v.name}</span>
							</Link>
						))}
					</div>
				)}
			</>
		);
	}
);

ProductSearch.displayName = 'ProductSearch';
