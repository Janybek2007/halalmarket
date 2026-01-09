import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';
import { ICategory } from '~/entities/categories';
import { SuccessResponse } from '~/global';
import { http } from '~/shared/api/http';
import { useConfirm } from '~/shared/libs/confirm';
import { queryClient } from '~/shared/libs/tanstack';

export const useCategoryDeleteMutation = () => {
	const { openConfirm } = useConfirm();

	const deleteMutation = useMutation({
		mutationKey: ['delete-category'],
		mutationFn: (params: { slug: string; deleteChildren: boolean }) =>
			http.delete<SuccessResponse>(
				`categories/${params.slug}/delete/?delete_children=${params.deleteChildren}`
			)
	});

	const handleDeleteConfirm = React.useCallback(
		(category: ICategory, count?: number, hasParent?: boolean) => {
			const getText = () => {
				if (hasParent) return 'Удалить категорию';
				if (count === undefined) return 'Удалить дочерние категории';
				return `Удалить дочерние категории — ${count} ${
					count === 1 ? 'категория' : 'категории'
				}`;
			};

			openConfirm({
				title: 'Удалить категорию?',
				text: `Вы уверены, что хотите удалить категорию "${category.name}"?`,
				confirmText: 'Удалить',
				checkBox: true,
				checkBoxText: getText(),
				cancelText: 'Отмена',
				async confirmCallback({ checked }) {
					try {
						const result = await deleteMutation.mutateAsync({
							slug: category.slug,
							deleteChildren: checked ?? false
						});
						if (result.success) {
							await queryClient.refetchQueries({
								queryKey: ['get-categories', category]
							});
							toast.success('Категория удалена');
						}
					} catch (error) {
						toast.error('Ошибка при удаление категории');
						throw error;
					}
				}
			});
		},
		[deleteMutation, openConfirm]
	);

	return { handleDeleteConfirm };
};
