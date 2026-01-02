import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useSession } from '~/app/providers/session';
import { IProduct } from '~/entities/products';
import { SuccessResponse } from '~/global';
import { http } from '~/shared/api/http';
import { queryClient } from '~/shared/libs/tanstack';
import { unauthorizedToast } from '~/shared/utils/unauthorized-toast';
import { SendReviewDto, SendReviewSchema } from './review-send.contract';

export const useSendReviewMutation = (slug: string) => {
	const form = useForm({
		resolver: zodResolver(SendReviewSchema),
		defaultValues: {
			files: [],
			slug
		}
	});
	const formData = form.watch();
	const { user: profile } = useSession();

	const { mutateAsync: sendReview, error: apiError } = useMutation({
		mutationKey: ['send-review', `with-product-${slug}`],
		mutationFn: (parsedBody: SendReviewDto) => {
			const fd = new FormData();
			fd.append('rating', parsedBody.rating.toString());
			fd.append('comment', parsedBody.comment);
			if (parsedBody.files?.length) {
				parsedBody.files.forEach(file => fd.append('files', file));
			}
			return http.post<SuccessResponse & { new_average_rating: number }>(
				`product/${slug}/review/`,
				fd
			);
		}
	});

	const onSubmit = React.useCallback(
		async (data: SendReviewDto) => {
			if (!profile) {
				unauthorizedToast();
				return;
			}
			if (!data.rating || !data.comment) return;
			try {
				const r = await sendReview(data);
				if (r.success) {
					form.reset();
					queryClient.refetchQueries({
						queryKey: ['get-reviews_product', slug]
					});
					queryClient.setQueryData<IProduct>(
						['get-product', slug],
						prev =>
							({ ...prev, average_rating: r.new_average_rating } as IProduct)
					);
				}
			} catch (error: any) {
				toast.error(error?.detail || error?.error || 'Ошибка отправки отзыва');
			}
		},
		[profile, sendReview]
	);

	const handleRemovePhoto = React.useCallback(
		(index: number) => {
			if (!formData.files) return;
			form.setValue(
				'files',
				formData.files.filter((_, i) => i !== index)
			);
		},
		[formData.files]
	);
	const handleUpload = React.useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			if (!e.target.files) return;
			form.setValue(
				'files',
				formData.files?.length !== 4
					? [...(formData.files || []), ...Array.from(e.target.files)]
					: formData.files
			);
		},
		[formData.files]
	);

	return {
		onsubmit: form.handleSubmit(onSubmit),
		apiError,
		form,
		handleRemovePhoto,
		handleUpload
	};
};
