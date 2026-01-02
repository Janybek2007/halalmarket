import { CategoriesService } from '~/entities/categories';
import { $Meta } from '~/shared/libs/seo';
import { RoutePaths } from '~/shared/router';
import { CategoriesPage } from './page.ui';

export const metadata = $Meta({
	title: 'Меню категорий',
	description:
		'Просмотрите наши категории и выберите интересующие блюда или товары.',
	url: RoutePaths.Guest.Categories
});

export default async () => {
	const categories = await CategoriesService.GetCategories({
		is_null_parent: 'true',
		get_childs: 'true'
	});

	return <CategoriesPage iCategories={categories} />;
};
