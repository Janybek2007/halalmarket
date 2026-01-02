'use client';
import clsx from 'clsx';
import React, { Suspense } from 'react';
import { CategoriesService, ICategory } from '~/entities/categories';
import { CUCategoryDrawer } from '~/features/category/create-update';
import { useCategoryDeleteMutation } from '~/features/category/delete';
import { Assets } from '~/shared/assets';
import { State } from '~/shared/components/state/state.ui';
import { ApiMedia } from '~/shared/constants';
import { useQueryString } from '~/shared/hooks';
import { useKeepQuery } from '~/shared/libs/tanstack';
import { Button } from '~/shared/ui/button/button.ui';
import { Icon } from '~/shared/ui/icon/icon.ui';
import { Input } from '~/shared/ui/input/input.ui';
import s from './page.module.scss';

export default () => {
	return <Suspense><AdminCategoriesPage/></Suspense>;
};

function AdminCategoriesPage() {
	const [modalOpen, setModalOpen] = React.useState<boolean | ICategory>(false);
	const [category, setCategory] = useQueryString('category');
	const [search, setSearch] = React.useState('');

	const { handleDeleteConfirm } = useCategoryDeleteMutation();

	const {
		data: categories,
		isLoading,
		error
	} = useKeepQuery({
		queryKey: ['get-categories', category],
		queryFn: () =>
			CategoriesService.GetCategories({
				is_null_parent: 'true',
				get_childs: 'true',
				parent: category
			})
	});

	const filteredCategories = React.useMemo(() => {
		if (!categories) return [];

		const searchTrimmed = search.trim();
		if (!searchTrimmed) return categories;

		const flattenCategories = (cats: ICategory[]): ICategory[] => {
			let result: ICategory[] = [];
			for (const cat of cats) {
				result.push(cat);
				if (cat.childs && cat.childs.length > 0) {
					result = result.concat(flattenCategories(cat.childs));
				}
			}
			return result;
		};

		const allCategories = flattenCategories(categories);

		return allCategories.filter((cat: ICategory) =>
			cat.name.toLowerCase().includes(searchTrimmed.toLowerCase())
		);
	}, [categories, search]);

	return (
		<>
			<div className={s.adminCategoriesPage}>
				<div className={s.header}>
					<Input
						name='search'
						placeholder='Поиск по названию...'
						value={search}
						onChange={e => setSearch(e.target.value)}
					/>
					<Button
						leftIcon='mynaui:plus'
						onClick={() => setModalOpen(true)}
					></Button>
					{category && (
						<Button
							variant='outline'
							className={s.backButton}
							leftIcon='lucide:arrow-left'
							onClick={() => setCategory('')}
						>
							Назад
						</Button>
					)}
				</div>

				{isLoading ? (
					<State
						icon='line-md:loading-alt-loop'
						title='Загрузка...'
						text='Пожалуйста, подождите'
					/>
				) : error ? (
					<State
						icon='lucide:alert-triangle'
						title='Ошибка'
						text='Не удалось загрузить категории'
					/>
				) : filteredCategories.length === 0 ? (
					<State
						icon='lucide:folder-open'
						title='Нет категорий'
						text='Добавьте первую категорию'
					/>
				) : (
					<div className={s.grid}>
						{filteredCategories.map((_category, i) => (
							<div key={`${_category.id}-${i}-category-key`} className={s.card}>
								<div className={s.cardHeader}>
									<img
										src={
											_category.image
												? ApiMedia(_category.image)
												: Assets.Placeholder
										}
										alt={_category.name}
										className={s.cardImage}
									/>
									<div className={s.cardContent}>
										<button
											onClick={() =>
												category ? undefined : setCategory(_category.slug)
											}
											className={s.cardTitle}
										>
											{_category.name}
										</button>
										{!category && (
											<span className={s.cardChilds}>
												{_category.childs?.length || 0} подкатегорий
											</span>
										)}
									</div>
									<div className={s.cardActions}>
										<button
											className={clsx(s.action, s.edit)}
											onClick={() => setModalOpen(_category)}
										>
											<Icon name='lucide:edit' />
										</button>
										<button
											className={clsx(s.action, s.trash)}
											onClick={() => handleDeleteConfirm(_category)}
										>
											<Icon name='lucide:trash-2' />
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
			{modalOpen && (
				<CUCategoryDrawer
					editCategory={typeof modalOpen === 'boolean' ? undefined : modalOpen}
					onclose={() => setModalOpen(false)}
				/>
			)}
		</>
	);
}
