import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';

import { SellersQuery } from '~/entities/sellers';
import { Assets } from '~/shared/assets';
import { ErrorList } from '~/shared/components/error-list/error-list.ui';
import { FormField } from '~/shared/components/form-field/form-field.ui';
import { State } from '~/shared/components/state/state.ui';
import { ApiMedia } from '~/shared/constants';
import { Button } from '~/shared/ui/button/button.ui';
import { Drawer } from '~/shared/ui/drawer/drawer.ui';
import {
	SelectedProduct,
	usePromotionAddMutation
} from '../promotion-add.mutation';
import s from './styles.module.scss';
import Image from 'next/image'

export const AddPromotionDrawer: React.FC<{ onClose: VoidFunction }> =
	React.memo(({ onClose }) => {
		const [currentStep, setCurrentStep] = React.useState<number>(1);
		const [selectedProduct, setSelectedProduct] =
			React.useState<SelectedProduct | null>(null);

		const handleNextStep = React.useCallback((product: SelectedProduct) => {
			setSelectedProduct(product);
			setCurrentStep(2);
		}, []);

		const handlePrevStep = React.useCallback(() => {
			setCurrentStep(1);
		}, []);

		return (
			<Drawer
				header={
					<h4 className={s.headerTitle}>
						Добавить акцию {currentStep == 1 ? '(Выбор товара)' : '(Настройки)'}
					</h4>
				}
				onClose={onClose}
				className={s.addPromotion}
			>
				<div className={s.content}>
					{currentStep === 1 && <Step1 next={handleNextStep} />}
					{currentStep === 2 && selectedProduct && (
						<Step2
							prev={handlePrevStep}
							product={selectedProduct}
							onClose={onClose}
						/>
					)}
				</div>
			</Drawer>
		);
	});

const Step1 = React.memo<{ next: (product: SelectedProduct) => void }>(
	({ next }) => {
		const { data, isLoading } = useQuery(
			SellersQuery.GetStoreProductsQuery({})
		);
		const [selectedProduct, setSelectedProduct] =
			React.useState<SelectedProduct | null>(null);

		const handleNext = React.useCallback(() => {
			if (selectedProduct) {
				next(selectedProduct);
			} else {
				toast.error('Выберите продукт');
			}
		}, [next, selectedProduct]);

		return (
			<>
				{isLoading ? (
					<State
						icon='line-md:loading-alt-loop'
						title='Загрузка...'
						text='Пожалуйста, подождите'
					/>
				) : data?.results?.length === 0 ? (
					<State
						title='Нет данных'
						text='Продукты отсутствуют или не найдены'
					/>
				) : (
					<div className={s.productsList}>
						{data?.results?.map(product => (
							<div
								key={product.id}
								className={`${s.productItem} ${
									selectedProduct?.id === product.id ? s.selected : ''
								}`}
								role='button'
								tabIndex={0}
								onClick={() => setSelectedProduct(product)}
								onKeyDown={e => {
									if (e.key === 'Enter' || e.key === ' ') {
										setSelectedProduct(product);
									}
								}}
								aria-pressed={selectedProduct?.id === product.id}
							>
								<img
									src={ApiMedia(product.images[0].image, { h: 180 })}
									alt={product.name}
								/>
								<h6>{product.name}</h6>
							</div>
						))}
					</div>
				)}

				<div className={s.actionButtons}>
					<Button onClick={handleNext} disabled={!selectedProduct}>
						Далее
					</Button>
				</div>
			</>
		);
	}
);

interface Step2Props {
	prev: VoidFunction;
	product: SelectedProduct;
	onClose: VoidFunction;
}

const Step2 = React.memo<Step2Props>(({ prev, product, onClose }) => {
	const { apiError, form, isDiscountSelect, isPending, onsubmit } =
		usePromotionAddMutation(onClose, product);

	const errors = form.formState.errors;
	return (
		<form onSubmit={onsubmit} className={s.stepContainer}>
			{product && (
				<div className={s.selectedProduct}>
					<div className={s.productImage}>
						<Image
							width={80}
							height={80}
							src={ApiMedia(product.images[0].image, { w: 80, h: 80 })}
							alt={product.name}
						/>
					</div>
					<div className={s.productInfo}>
						<h6>{product.name}</h6>
					</div>
				</div>
			)}

			<FormField
				label='Установите скидку'
				name='discount'
				fullWidth
				error={errors.discount?.message}
				className={s.formField}
				field={{
					type: !isDiscountSelect ? 'text' : 'select',
					placeholder: 'Выберите скидку',
					onChange: e => form.setValue('discount', e.target.value),
					value: String(form.watch('discount')),
					options: [
						{ value: '40', label: '40%' },
						{ value: '45', label: '45%' },
						{ value: '50', label: '50%' },
						{ value: '55', label: '55%' },
						{ value: '60', label: '60%' },
						{ value: '', label: 'Другое' }
					],
					...(!isDiscountSelect && {
						endIcon: 'radix-icons:reset',
						endIconClick: () => form.setValue('discount', '40')
					})
				}}
			/>

			<FormField
				label='Дата окончания акции'
				name='expires_at'
				fullWidth
				error={errors.expires_at?.message}
				className={s.formField}
				field={{
					type: 'datetime-local',
					placeholder: 'Выберите дату окончания акции',
					value: form.watch('expires_at'),
					onChange: e => form.setValue('expires_at', e.target.value)
				}}
			/>

			<div className={s.imageSection}>
				<div className={s.imageContainer}>
					{form.watch('thumbnail') ? (
						<img
							src={URL.createObjectURL(form.watch('thumbnail')!)}
							alt='promotion'
						/>
					) : (
						<div className={s.placeholder}>Изображение не выбрано</div>
					)}
				</div>
				<label htmlFor='thumbnail' className={s.uploadPhotoButton}>
					<span>Загрузите фото акции</span>
					<img src={Assets.FileSvg} alt='file-svg | Icon' />
				</label>
				<input
					type='file'
					accept='image/*'
					hidden
					id='thumbnail'
					onChange={e => form.setValue('thumbnail', e.target.files?.[0])}
				/>
			</div>

			<div className={s.actionButtons}>
				<Button type='button' variant='outline' onClick={prev}>
					Назад
				</Button>
				<Button
					type='submit'
					loading={isPending}
					disabled={isPending}
					loadingText='Сохранение...'
				>
					Создать акцию
				</Button>
			</div>
			<ErrorList errors={[apiError]} isView={form.formState.isSubmitted} />
		</form>
	);
});

AddPromotionDrawer.displayName = 'AddPromotionDrawer';
Step1.displayName = 'Step1';
Step2.displayName = 'Step2';
