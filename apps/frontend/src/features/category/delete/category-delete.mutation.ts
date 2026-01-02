import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';
import { ICategory } from '~/entities/categories';
import { SuccessResponse } from '~/global';
import { http } from '~/shared/api/http';
import { TSlug } from '~/shared/api/types';
import { useConfirm } from '~/shared/libs/confirm';

export const useCategoryDeleteMutation = () => {
	const { openConfirm } = useConfirm();

	const deleteMutation = useMutation({
		mutationKey: ['delete-category'],
		mutationFn: (parsedSlug: TSlug) =>
			http.delete<SuccessResponse>(`categories/${parsedSlug.slug}/delete/`)
	});
	const handleDeleteConfirm = React.useCallback(
		(category: ICategory) => {
			openConfirm({
				title: 'Удалить категорию?',
				text: `Вы уверены, что хотите удалить категорию "${category.name}"?`,
				confirmText: 'Удалить',
				cancelText: 'Отмена',
				confirmCallback() {
					toast.promise(
						deleteMutation.mutateAsync({
							slug: category.slug
						}),
						{
							loading: 'Удаление...',
							success: 'Категория удалена',
							error: 'Ошибка при удалении'
						}
					);
				}
			});
		},
		[deleteMutation, openConfirm]
	);
	return { handleDeleteConfirm };
};
