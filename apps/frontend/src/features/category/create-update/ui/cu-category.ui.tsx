import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { CategoriesService, ICategory } from '~/entities/categories';
import { ErrorList } from '~/shared/components/error-list/error-list.ui';
import { FormField } from '~/shared/components/form-field/form-field.ui';
import { Button } from '~/shared/ui/button/button.ui';
import { Drawer } from '~/shared/ui/drawer/drawer.ui';
import { useCUCategoryMutation } from '../cu-category.mutation';
import s from './styles.module.scss';

// Create Or Update Category
export const CUCategoryDrawer: React.FC<{
	onclose: VoidFunction;
	editCategory?: ICategory;
}> = React.memo(({ onclose, editCategory }) => {
	const { data: categories } = useQuery({
		queryKey: ['is-null-parent-get-categories'],
		queryFn: () =>
			CategoriesService.GetCategories({
				is_null_parent: 'true'
			})
	});

	const finalOptions = React.useMemo(() => {
		if (!categories) return [];
		let r = categories
			.filter(cat => cat.id !== editCategory?.id)
			.map(cat => ({
				value: cat.id,
				label: cat.name
			}));
		r.unshift({
			value: 'null' as unknown as number,
			label: 'Без родителя'
		});
		return r;
	}, [categories, editCategory?.id]);

	const { onsubmit, handleFormChange, apiError, form, isPending } =
		useCUCategoryMutation(
			editCategory,
			editCategory ? 'update' : 'create',
			onclose
		);
	const errors = form.formState.errors;
	const values = form.watch();

	return (
		<Drawer
			header={
				<h4 className={s.headerTitle}>
					{editCategory ? 'Редактирование категории' : 'Создание категории'}
				</h4>
			}
			onClose={onclose}
		>
			<form className={s.form} onSubmit={onsubmit}>
				<h2>
					{editCategory ? 'Редактировать категорию' : 'Создать категорию'}
				</h2>
				<FormField
					label='Название категории'
					name='name'
					error={errors.name?.message}
					field={{
						type: 'text',
						register: form.register('name'),
						placeholder: 'Введите название категории'
					}}
				/>
				<FormField
					label='Родительская категория'
					name='parent_id'
					error={errors.parent_id?.message}
					field={{
						type: 'select',
						name: 'parent_id',
						value: values.parent_id || 'null',
						onChange: e => handleFormChange(e),
						placeholder: 'Выберите родительскую категорию',
						options: finalOptions || []
					}}
				/>
				<FormField
					label='Изображение'
					name='image'
					error={errors.image?.message}
					field={{
						type: 'file',
						onChange: handleFormChange,
						accept: 'image/*'
					}}
				/>
				<FormField
					label='Порядок'
					name='order'
					error={errors.order?.message}
					field={{
						type: 'number',
						register: form.register('order'),
						placeholder: 'Введите порядок'
					}}
				/>

				<div className={s.formActions}>
					<Button type='submit' loading={isPending} disabled={isPending}>
						{editCategory ? 'Сохранить' : 'Создать'}
					</Button>
					<Button variant='outline' type='button' onClick={() => onclose()}>
						Отмена
					</Button>
				</div>
				<ErrorList errors={[apiError]} isView={form.formState.isSubmitted} />
			</form>
		</Drawer>
	);
});

CUCategoryDrawer.displayName = 'CUCategoryDrawer';
