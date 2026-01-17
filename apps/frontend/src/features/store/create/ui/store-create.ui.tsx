import React from 'react';

import Link from 'next/link';
import { ErrorList } from '~/shared/components/error-list/error-list.ui';
import { FormField } from '~/shared/components/form-field/form-field.ui';
import { RoutePaths } from '~/shared/router';
import { Button } from '~/shared/ui/button/button.ui';
import { Checkbox } from '~/shared/ui/checkbox/checkbox.ui';
import { Drawer } from '~/shared/ui/drawer/drawer.ui';
import { useStoreCreateMutation } from '../store-create.mutation';
import s from './styles.module.scss';
import { Assets } from '~/shared/assets'

export const CreateStore: React.FC<{ onClose: VoidFunction }> = React.memo(({
	onClose
}) => {
	const { apiError, form, isPending, onsubmit } =
		useStoreCreateMutation(onClose);

	const errors = form.formState.errors;

	return (
		<Drawer
			header={<h3 className={s.headerTitle}>Создание магазина</h3>}
			onClose={close}
			className={s.createStoreContainer}
		>
			<div className={s.createStoreCard}>
				<form className={s.form} onSubmit={onsubmit}>
					<div className={s.imageSection}>
						<div className={s.imageContainer}>
							<img
								src={
									form.watch('store_logo')
										? URL.createObjectURL(form.watch('store_logo')!)
										: Assets.Placeholder
								}
								alt={form.watch('store_name') || 'placeholder'}
							/>
						</div>
						<label htmlFor='image' className={s.uploadPhotoButton}>
							<span>Загрузите фото</span>
							<img src={Assets.FileSvg} alt='file-svg | Icon' />
						</label>
						<input
							type='file'
							id='image'
							hidden
							accept='image/*'
							onChange={e => form.setValue('store_logo', e.target.files?.[0]!)}
						/>
					</div>
					<FormField
						label='Название магазина*'
						name='name'
						error={errors.store_name?.message}
						fullWidth
						className={s.formField}
						field={{
							type: 'text',
							placeholder: 'Название магазина',
							register: form.register('store_name')
						}}
					/>

					<div className={s.policySection}>
						<Checkbox
							checked={!!form.watch('is_read_policy')}
							onChecked={checked => form.setValue('is_read_policy', checked)}
							color='color-1'
						/>
						<span className={s.policyLabel}>
							Я соглашаюсь с
							<Link
								href={RoutePaths.Seller.Policy}
								target='_blank'
								className={s.policyLink}
							>
								политикой магазина
							</Link>
						</span>
					</div>

					<div className={s.buttonGroup}>
						<Button
							type='button'
							variant='outline'
							className={s.backButton}
							disabled={isPending}
							onClick={onClose}
						>
							Назад
						</Button>
						<Button
							type='submit'
							className={s.saveButton}
							loading={isPending}
							disabled={isPending}
							loadingText='Создание...'
						>
							Создать
						</Button>
					</div>
					<ErrorList errors={[apiError]} isView={form.formState.isSubmitted} />
				</form>
			</div>
		</Drawer>
	);
});

CreateStore.displayName = 'CreateStore';
