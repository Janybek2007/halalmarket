'use client';
import React from 'react';

import Link from 'next/link';
import { ICategory } from '~/entities/categories';
import { Assets } from '~/shared/assets';
import { ApiMedia } from '~/shared/constants';
import { RoutePaths } from '~/shared/router';
import { Icon } from '~/shared/ui/icon/icon.ui';
import s from './styles.module.scss';

interface CategoriesProps {
	categories: ICategory[];
}

const AllCategories: ICategory = {
	id: -1,
	order: 0,
	slug: 'all',
	name: 'Все категории',
	image: '/seo/favicon.png',
	actions: null
};

export const Categories: React.FC<CategoriesProps> = React.memo(
	({ categories }) => {
		return (
			<section className={s.categories}>
				<div className='container'>
					<div className={s.header}>
						<h1 className={s.title}>Все категории</h1>
					</div>

					<div className={`${s.list}`}>
						{[AllCategories, ...categories]
							.sort((a, b) => a.order - b.order)
							.map(category => (
								<Link
									key={category.id}
									href={
										category.slug === 'all'
											? RoutePaths.Guest.Categories
											: RoutePaths.Guest.Category(category.slug)
									}
									className={`${s.category} ${
										category.slug == 'all' && s.allc
									}`}
								>
									<div className={s.view1}>
										<div className={s.imageWrapper}>
											<img
												src={
													category.image
														? ApiMedia(category.image)
														: Assets.Placeholder
												}
												alt={category.name}
												className={s.image}
											/>
										</div>
										<div className={s.overlay}>
											<span className={s.name}>{category.name}</span>
										</div>
									</div>
									<div className={s.view2}>
										{category.slug === 'all' && <Icon name='lucide:menu' />}
										<div className={s.name}>{category.name}</div>
									</div>
								</Link>
							))}
					</div>
				</div>
			</section>
		);
	}
);

Categories.displayName = 'Categories';

export default Categories;
