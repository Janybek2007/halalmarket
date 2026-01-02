import clsx from 'clsx';
import Link from 'next/link';
import { CategoriesService } from '~/entities/categories';
import { Assets } from '~/shared/assets';
import { ApiMedia } from '~/shared/constants';
import { $Meta } from '~/shared/libs/seo';
import { RoutePaths } from '~/shared/router';
import s from './page.module.scss';

export const metadata = $Meta({
	title: 'Меню',
	description:
		'Просмотрите наши категории и выберите интересующие блюда или товары.',
	url: RoutePaths.Guest.Categories
});

export default async () => {
	const categories = await CategoriesService.GetCategories({
		is_null_parent: 'true',
		get_childs: 'true'
	});
	return (
		<main className={s.categoriesPage}>
			<div className={clsx('container', s.container)}>
				<>
					<h1 className={s.title}>Меню</h1>

					<div className={s.categoriesGrid}>
						{categories?.map(category => (
							<Link
								key={category.id}
								href={RoutePaths.Guest.Category(category.slug)}
								className={s.categoryCard}
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
								<div className={s.categoryName}>{category.name}</div>
							</Link>
						))}
					</div>
				</>
			</div>
		</main>
	);
};
