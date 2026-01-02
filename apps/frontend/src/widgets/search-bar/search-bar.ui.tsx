'use client';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { usePathname, useRouter } from 'next/navigation';
import { CategoriesService } from '~/entities/categories';
import { Assets } from '~/shared/assets';
import { ProductSearch } from '~/shared/components/product-search/product-search.ui';
import { RoutePaths } from '~/shared/router';
import { Button } from '~/shared/ui/button/button.ui';
import { Select } from '~/shared/ui/select/select.ui';
import s from './styles.module.scss';

const SearchBar: React.FC<{}> = React.memo(() => {
	const router = useRouter();
	const { data: categories } = useQuery({
		queryKey: ['is-null-parent-categories'],
		queryFn: () => CategoriesService.GetCategories({ is_null_parent: 'true' })
	});

	return (
		<div className={s.searchBar}>
			<div className={`${s['container']} container`}>
				<Button
					as='a'
					to={RoutePaths.Guest.Categories}
					type='submit'
					className={s.menuButton}
					variant={'outline'}
				>
					<img src={Assets.MenuSvg} alt='Menu Svg | Icon' />
					<span>Меню</span>
				</Button>

				<div className={s.inputWrapper}>
					<ProductSearch className={s.searchInput} />

					<Select
						value={'Все категории'}
						placeholder='Все категории'
						onChange={value => router.push(RoutePaths.Guest.Category(value))}
						options={
							categories
								? categories
										.filter(v => !v.parent)
										.map(v => ({ value: v.slug, label: v.name }))
								: []
						}
						className={s.categorySelect}
					></Select>
				</div>

				<Button className={s.searchButton}>Искать</Button>
			</div>
		</div>
	);
});

export default function SearchBarWrapper() {
	const pathname = usePathname();
	return (
		<div className={s.serchBarWrapper}>
			{![RoutePaths.Guest.Categories].some(v => pathname.startsWith(v)) && (
				<SearchBar />
			)}
		</div>
	);
}

SearchBar.displayName = 'SearchBar';
