import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { CategoriesService } from '~/entities/categories';
import { IProduct } from '~/entities/products';
import { SellersQuery } from '~/entities/sellers';
import { SuccessResponse } from '~/global';
import { http } from '~/shared/api/http';
import { queryClient } from '~/shared/libs/tanstack';
import { buildProductFormData } from '~/shared/utils/build-form-data';
import {
	ProductCreateDto,
	ProductCreateSchema,
	ProductUpdateDto,
	ProductUpdateSchema
} from './product-cu.contract';

interface ImageItem {
	file?: File;
	url: string;
	isDeleted?: boolean;
	id?: number;
}

export const useProductCUMutation = (
	onClose: VoidFunction,
	product?: IProduct
) => {
	const isEditMode = product !== undefined;

	const form = useForm({
		resolver: zodResolver(
			isEditMode ? ProductUpdateSchema : ProductCreateSchema
		),
		defaultValues:
			isEditMode && product
				? {
						...product,
						images: product.images.map(image => ({
							url: image.image,
							isDeleted: false,
							id: +image.id
						})),
						subcategory:
							typeof product.subcategory !== 'object'
								? Number(product.subcategory)
								: product.subcategory.id,
						discount: Number(product.discount).toFixed(0),
						price: Number(product.price).toFixed(0)
				  }
				: {
						name: '',
						country: 'kyrgyzstan',
						code: '',
						composition: '',
						expiration_date: '6months',
						equipment: 'box',
						action: '',
						images: [],
						price: 0,
						discount: '0',
						description: '',
						subcategory: undefined,
						items_in_package: undefined
				  }
	});

	const formData = form.watch();

	const { data: categories } = useQuery({
		queryKey: ['get-categories_to_product_cu'],
		queryFn: () => CategoriesService.GetCategories({ is_null_parent: 'false' })
	});

	const imagesWithUrls = React.useMemo(() => {
		return (
			(formData.images as ImageItem[])?.map(img => {
				if (img.file && !img.url) {
					return {
						...img,
						url: URL.createObjectURL(img.file)
					};
				}
				return img;
			}) || []
		);
	}, [formData.images]);

	React.useEffect(() => {
		return () => {
			imagesWithUrls.forEach(img => {
				if (img.file && img.url) {
					URL.revokeObjectURL(img.url);
				}
			});
		};
	}, [imagesWithUrls]);

	const filteredImages = React.useMemo(
		() => imagesWithUrls.filter(img => !img.isDeleted),
		[imagesWithUrls]
	);

	const deleteImage = React.useCallback(
		(index: number) => {
			const images = formData.images as ImageItem[];

			if (isEditMode) {
				const newImages = [...images];
				const img = newImages[index];

				if (!img) return;

				if (img.file instanceof File) {
					newImages.splice(index, 1);
				} else if (img.url) {
					newImages[index] = { ...img, isDeleted: true };
				}

				form.setValue('images', newImages, { shouldValidate: true });
			} else {
				form.setValue(
					'images',
					images.filter((_, i) => i !== index)
				);
			}
		},
		[formData.images, isEditMode]
	);

	const handleImageUpload = React.useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const files = Array.from(e.target.files || []);
			const maxImages = 20;
			const currentImages = (formData.images as ImageItem[]).filter(
				img => !img.isDeleted
			);

			if (currentImages.length + files.length > maxImages) {
				toast.error(`Максимум ${maxImages} изображений можно загрузить`);
				return;
			}

			const newImages = files
				.filter(file => file.type.startsWith('image/'))
				.map(file => ({
					file,
					url: '',
					isDeleted: false
				}));

			form.setValue(
				'images',
				[...(formData.images as ImageItem[]), ...newImages],
				{
					shouldValidate: true
				}
			);
		},
		[formData.images]
	);

	const {
		mutateAsync: mutate,
		error: apiError,
		isPending
	} = useMutation({
		mutationKey: [
			'cu-product',
			`product-${isEditMode ? 'edit' : 'create'}`,
			product
		],
		mutationFn: (parsedBody: ProductCreateDto | ProductUpdateDto) => {
			const fd = buildProductFormData(parsedBody);
			const url = isEditMode
				? `store/product/${product.id}/`
				: 'store/product/create/';

			return http[isEditMode ? 'patch' : 'post']<SuccessResponse>(url, fd);
		}
	});

	const onSubmit = React.useCallback(
		async (data: ProductCreateDto | ProductUpdateDto) => {
			toast.promise(
				async () => {
					const params = isEditMode ? { ...data, id: product?.id } : data;

					const r = await mutate(params);
					if (r.success) {
						onClose();
						queryClient.refetchQueries({
							queryKey: SellersQuery.QueryKeys.GetStoreProducts({})
						});
					}
				},
				{
					loading: isEditMode
						? 'Обновление продукта...'
						: 'Создание продукта...',
					success: isEditMode
						? 'Продукт успешно обновлен!'
						: 'Продукт успешно создан!',
					error: isEditMode
						? 'Ошибка при обновлении продукта'
						: 'Ошибка при создании продукта'
				}
			);
		},
		[isEditMode, product?.id, onClose]
	);

	return {
		form,
		categories,
		filteredImages,
		deleteImage,
		handleImageUpload,
		apiError,
		isPending,
		onsubmit: form.handleSubmit(onSubmit)
	};
};
