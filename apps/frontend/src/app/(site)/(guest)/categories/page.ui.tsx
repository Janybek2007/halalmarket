'use client';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { CategoriesService, TGetCategories } from '~/entities/categories';
import { Assets } from '~/shared/assets';
import { ApiMedia } from '~/shared/constants';
import { RoutePaths } from '~/shared/router';
import s from './page.module.scss';

export function CategoriesPage(props: { categories: TGetCategories }) {
	const { data: categories } = useQuery({
		queryKey: ['get-categories_'],
		queryFn: () =>
			CategoriesService.GetCategories({
				is_null_parent: 'true',
				get_childs: 'true'
			}),
		initialData: props.categories.length > 0 ? props.categories : undefined
	});

	return (
		<main className={s.categoriesPage}>
			<div className={clsx('container', s.container)}>
				<>
					<h1 className={s.title}>Меню</h1>

					<div className={s.categoriesGrid}>
						{categories?.map(category => (
							<Link
								prefetch={false}
								key={category.id}
								href={RoutePaths.Guest.Category(category.slug)}
								className={s.categoryCard}
							>
								<div className={s.imageWrapper}>
									<Image
										width={128}
										height={128}
										src={
											category.image
												? ApiMedia(category.image, { w: 128, h: 128 })
												: Assets.Placeholder
										}
										alt={category.name}
										className={s.image}
									/>
								</div>
								<div className={s.categoryName}>{category.name}</div>
							</Link>
						))}
					</div>
				</>
			</div>
		</main>
	);
}
