import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ICategory } from '~/entities/categories';
import { SuccessResponse } from '~/global';
import { http } from '~/shared/api/http';
import { InputOnChange } from '~/shared/ui/input/input.types';
import { CUCategoryDto, CUCategorySchema } from './cu-category.contract';

const initialForm: CUCategoryDto = {
	name: '',
	image: null,
	parent_id: 0,
	order: undefined
};

export const useCUCategoryMutation = (
	editCategory?: ICategory,
	action: 'create' | 'update' = 'create',
	onClose?: VoidFunction
) => {
	const form = useForm<CUCategoryDto>({
		resolver: zodResolver(CUCategorySchema),
		defaultValues: editCategory
			? {
					parent_id: editCategory.parent?.id,
					name: editCategory.name,
					slug: editCategory.slug,
					order: String(editCategory.order)
			  }
			: initialForm
	});

	const {
		error: apiError,
		isPending,
		...createUpdateMutation
	} = useMutation({
		mutationKey: ['create-update-category'],
		mutationFn: (parsedBody: CUCategoryDto) => {
			if (action === 'create') {
				const fd = new FormData();
				Object.entries(parsedBody).forEach(([key, value]) => {
					if (value) fd.append(key, value as any);
				});
				return http.post<SuccessResponse>(`categories/create/`, fd);
			} else {
				if (!parsedBody.slug) {
					throw new Error('Slug is required');
				}
				const fd = new FormData();
				Object.entries(parsedBody).forEach(([key, value]) => {
					if (value) fd.append(key, value as any);
				});
				return http.patch<SuccessResponse>(
					`categories/${parsedBody.slug}/update/`,
					fd
				);
			}
		}
	});

	const handleFormChange = React.useCallback(
		(e: Parameters<InputOnChange>[0]) => {
			const { name, value } = e.target;
			if (name === 'image') {
				form.setValue(name, (e.target as HTMLInputElement).files?.[0]);
			} else {
				form.setValue(name as 'name', value);
			}
		},
		[]
	);

	const onSubmit = React.useCallback(
		async (data: CUCategoryDto) => {
			toast.promise(
				async () => {
					const r = await createUpdateMutation.mutateAsync(data);
					if (r.success) {
						setTimeout(() => {
							form.reset();
							onClose?.();
						}, 300);
					}
				},
				{
					loading: editCategory ? 'Обновление...' : 'Сохранение...',
					success: editCategory ? 'Категория обновлена' : 'Категория создана',
					error: editCategory ? 'Ошибка при обновлении' : 'Ошибка при создании'
				}
			);
		},
		[createUpdateMutation, editCategory]
	);

	return {
		onsubmit: form.handleSubmit(onSubmit),
		handleFormChange,
		apiError,
		isPending,
		form
	};
};
