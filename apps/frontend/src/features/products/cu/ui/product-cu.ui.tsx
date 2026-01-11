'use client';

import clsx from 'clsx';
import React from 'react';

import { IProduct } from '~/entities/products';
import { Assets } from '~/shared/assets';
import { ErrorList } from '~/shared/components/error-list/error-list.ui';
import { FormField } from '~/shared/components/form-field/form-field.ui';
import {
	ApiMedia,
	COUNTRY_OPTIONS,
	DISCOUNT_OPTIONS,
	EQUIPMENT_OPTIONS,
	EXPIRATION_DATE_OPTIONS
} from '~/shared/constants';
import { Button } from '~/shared/ui/button/button.ui';
import { Drawer } from '~/shared/ui/drawer/drawer.ui';
import { Icon } from '~/shared/ui/icon/icon.ui';
import { useProductCUMutation } from '../product-cu.mutation';
import s from './styles.module.scss';

type ProductCUProps = {
	product?: IProduct;
	onClose: VoidFunction;
};

export const ProductCU: React.FC<ProductCUProps> = React.memo(
	({ product, onClose }) => {
		const isEdit = product !== undefined;

		const {
			apiError,
			categories,
			deleteImage,
			filteredImages,
			form,
			handleImageUpload,
			isPending,
			onsubmit
		} = useProductCUMutation(onClose, product);

		const errors = form.formState.errors;

		return (
			<Drawer
				header={
					<h4 className={s.headerTitle}>
						{isEdit ? 'Редактирование товара' : 'Создание продукта'}
					</h4>
				}
				onClose={onClose}
				className={s.drawer}
			>
				<div className={s.content}>
					<form className={s.form} onSubmit={onsubmit}>
						{/* 🍔 Изображения */}
						{Array.isArray(filteredImages) && (
							<div
								className={clsx(
									s.imagesContainer,
									filteredImages.length === 0 && s.empty
								)}
							>
								{filteredImages.map((image, i) => (
									<div className={s.imageWrapper} key={`image-${i}`}>
										<img
											src={
												image.file
													? image.url
													: ApiMedia(image.url, { w: 112, h: 112 })
											}
											alt='product'
											className={s.image}
										/>
										<button
											type='button'
											className={s.deleteButton}
											onClick={() => deleteImage(i)}
										>
											<Icon name='lucide:trash' c_size={14} />
										</button>
									</div>
								))}
							</div>
						)}

						<div className={s.imageGroup}>
							<div className={s.imageSection}>
								<label htmlFor='image' className={s.uploadPhotoButton}>
									<span>{isEdit ? 'Добавить фото' : 'Загрузите фото*'}</span>
									<img src={Assets.FileSvg} alt='upload-svg | Icon' />
								</label>
								<input
									type='file'
									accept='image/*'
									hidden
									multiple
									id='image'
									onChange={handleImageUpload}
								/>
							</div>
							{errors.images && (
								<p className={s.error}>{errors.images.message}</p>
							)}
						</div>

						{/* 📌 Поля */}
						{[
							{
								label: 'Название продукта*',
								name: 'name' as const,
								type: 'text',
								placeholder: 'Патчи для глаз',
								register: form.register('name')
							},
							{
								label: 'Код товара',
								name: 'code' as const,
								type: 'text',
								placeholder: '#12345678',
								register: form.register('code')
							},
							{
								label: 'Состав',
								name: 'composition' as const,
								type: 'text',
								placeholder: 'Состав',
								register: form.register('composition')
							}
						].map(field => (
							<FormField
								key={field.name}
								label={field.label}
								name={field.name}
								error={errors[field.name]?.message}
								fullWidth
								className={s.formField}
								field={field}
							/>
						))}

						{/* 🏷 Селекты */}
						<FormField
							label='Страна производства'
							name='country'
							error={errors.country?.message}
							fullWidth
							className={s.formField}
							field={{
								type: 'select-input',
								placeholder: 'Выберите страну',
								onChange: e => form.setValue('country', e.target.value),
								value: form.watch('country')!,
								options: COUNTRY_OPTIONS
							}}
						/>

						<FormField
							label='Срок годности'
							name='expiration_date'
							error={errors.expiration_date?.message}
							fullWidth
							className={s.formField}
							field={{
								type: 'select-input',
								placeholder: 'Выберите срок годности',
								onChange: e => form.setValue('expiration_date', e.target.value),
								value: form.watch('expiration_date')!,
								options: EXPIRATION_DATE_OPTIONS
							}}
						/>

						<FormField
							label='Упаковка'
							name='equipment'
							error={errors.equipment?.message}
							fullWidth
							className={s.formField}
							field={{
								type: 'select-input',
								placeholder: 'Выберите упаковку',
								onChange: e => form.setValue('equipment', e.target.value),
								value: form.watch('equipment')!,
								options: EQUIPMENT_OPTIONS
							}}
						/>

						<FormField
							label='Скидка'
							name='discount'
							error={errors.discount?.message}
							fullWidth
							className={s.formField}
							field={{
								type: 'select-input',
								placeholder: 'Выберите скидку',
								value: form.watch('discount'),
								onChange: e => form.setValue('discount', e.target.value),
								options: DISCOUNT_OPTIONS
							}}
						/>

						<FormField
							label='Описание'
							name='description'
							error={errors.description?.message}
							fullWidth
							className={s.formField}
							field={{
								type: 'textarea',
								placeholder: 'Описание товара',
								register: form.register('description'),
								className: s.textarea
							}}
						/>

						{/* Категория */}
						<FormField
							label='Категория продукта*'
							name='subcategory'
							error={errors.subcategory?.message}
							fullWidth
							className={s.formField}
							field={{
								type: 'select',
								placeholder: 'Выберите категорию',
								value: form.watch('subcategory'),
								onChange: e => form.setValue('subcategory', +e.target.value),
								options:
									categories?.map(category => ({
										value: String(category.id),
										label: `${category.parent?.name} / ${category.name}`
									})) || []
							}}
						/>

						{/* Цена и количество */}
						<FormField
							label='Количество'
							name='items_in_package'
							error={errors.items_in_package?.message}
							fullWidth
							className={s.formField}
							field={{
								type: 'number',
								placeholder: 'Установите количество',
								register: form.register('items_in_package')
							}}
						/>

						<FormField
							label='Цена*'
							name='price'
							error={errors.price?.message}
							fullWidth
							className={s.formField}
							field={{
								type: 'text',
								placeholder: 'Установите цену',
								register: form.register('price', {
									setValueAs(value) {
										return `${value} сом`;
									},
									valueAsNumber: true
								})
							}}
						/>

						{/* 🧵 Кнопки */}
						<div className={s.buttonGroup}>
							{!isEdit && (
								<Button
									type='button'
									variant='outline'
									className={s.backButton}
									onClick={onClose}
									disabled={isPending}
								>
									Назад
								</Button>
							)}
							<Button
								type='submit'
								className={s.saveButton}
								loading={isPending}
								disabled={isPending}
								loadingText={isEdit ? 'Сохранение...' : 'Создание...'}
							>
								{isEdit ? 'Сохранить' : 'Создать'}
							</Button>
						</div>

						<ErrorList
							errors={[apiError]}
							isView={form.formState.isSubmitted}
						/>
					</form>
				</div>
			</Drawer>
		);
	}
);

ProductCU.displayName = 'ProductCU';
