import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ImageItem, SuccessResponse } from '~/global';
import { http } from '~/shared/api/http';
import {
	PromotionRequestDto,
	PromotionRequestSchema
} from './promotion-add.contract';

export type SelectedProduct = {
	id: number;
	name: string;
	images: ImageItem[];
};

export const usePromotionAddMutation = (
	onClose: VoidFunction,
	product: SelectedProduct
) => {
	const {
		mutateAsync: request,
		isPending,
		error: apiError
	} = useMutation({
		mutationKey: ['promotion-add', product],
		mutationFn: (parsedBody: PromotionRequestDto) => {
			const fd = new FormData();
			Object.entries(parsedBody).forEach(([key, value]) => {
				if (Array.isArray(value)) fd.append(`products`, value.join(','));
				else fd.append(key, value);
			});
			return http.post<SuccessResponse>('promotion/request/');
		}
	});
	const form = useForm({
		resolver: zodResolver(PromotionRequestSchema),
		defaultValues: {
			discount: '40',
			thumbnail: undefined,
			products: [product.id],
			expires_at: new Date().toISOString().slice(0, 16)
		}
	});

	const isDiscountSelect = React.useMemo(
		() =>
			['40', '45', '50', '55', '60'].includes(
				form.watch('discount')?.toString() || ''
			),
		[form.watch('discount')]
	);

	const onSubmit = React.useCallback(
		async (data: PromotionRequestDto) => {
			toast.promise(
				async () => {
					const result = await request({
						...data,
						expires_at: new Date(data.expires_at).toISOString()
					});
					if (result.success) onClose();
					return result;
				},
				{
					loading: 'Отправка заявки...',
					success: 'Заявка на акцию отправлена!',
					error: 'Ошибка при отправке заявки'
				}
			);
		},
		[request, onClose]
	);
	return {
		onsubmit: form.handleSubmit(onSubmit),
		apiError,
		isPending,
		form,
		isDiscountSelect
	};
};
