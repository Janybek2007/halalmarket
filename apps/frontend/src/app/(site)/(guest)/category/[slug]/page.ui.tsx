'use client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { CategoriesService, TGetCategories } from '~/entities/categories';
import { Assets } from '~/shared/assets';
import { State } from '~/shared/components/state/state.ui';
import { ApiMedia } from '~/shared/constants';
import { RoutePaths } from '~/shared/router';
import Breadcrumb from '~/shared/ui/breadcrumb/breadcrumb.ui';
import s from './page.module.scss';

export function CategoryPage(props: {
	categories: TGetCategories;
	slug: string;
}) {
	const { data: categories } = useQuery({
		queryKey: ['get-categories-with-parent', props.slug],
		queryFn: () => CategoriesService.GetCategories({ parent: props.slug }),
		initialData: props.categories
	});
	const parentCategory = categories?.[0]?.parent;

	if (!categories || categories.length === 0) {
		return (
			<div className='container'>
				<State
					title='Отсутствуют подкатегории'
					text='В данный момент в этой категории нет подкатегорий. Попробуйте поискать в других категориях.'
				/>
			</div>
		);
	}

	return (
		<main className={s.categoryPage}>
			<h1 className={`${s.title} ${s.t1}`}>{parentCategory?.name || ''}</h1>
			<div className='container'>
				<Breadcrumb
					className={s.breadcrumb}
					items={[
						{
							label: 'Меню',
							path: RoutePaths.Guest.Categories,
							isActive: false
						},
						{
							label: parentCategory?.name || '',
							path: RoutePaths.Guest.Category(parentCategory?.slug || ''),
							isActive: true
						}
					]}
				/>

				<h1 className={`${s.title} ${s.t2}`}>{parentCategory?.name || ''}</h1>

				<div className={s.subcategoriesGrid}>
					{categories.map(category => (
						<Link
							key={category.id}
							href={RoutePaths.Guest.ProductsByCategory(category.slug)}
							className={s.subcategoryCard}
						>
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
							<div className={s.subcategoryName}>{category.name}</div>
						</Link>
					))}
				</div>
			</div>
		</main>
	);
}
