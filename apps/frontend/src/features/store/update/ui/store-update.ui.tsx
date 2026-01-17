import clsx from 'clsx';
import React from 'react';

import { useSession } from '~/app/providers/session';
import { ErrorList } from '~/shared/components/error-list/error-list.ui';
import { FormField } from '~/shared/components/form-field/form-field.ui';
import { ApiMedia } from '~/shared/constants';
import { Button } from '~/shared/ui/button/button.ui';
import { useStoreUpdateMutation } from '../store-update.mutation';
import s from './styles.module.scss';

export const StoreUpdate: React.FC = React.memo(() => {
	const { user } = useSession();
	const { apiError, form, handleLogoChange, isPending, onsubmit } =
		useStoreUpdateMutation();
	const errors = form.formState.errors;

	return (
		<form onSubmit={onsubmit} className={s.update}>
			<div className={s.header}>
				<div className={s.logoContainer}>
					<label
						className={clsx(s.logo, {
							[s.hasLogo]: user?.seller?.store_logo || form.watch('store_logo')
						})}
					>
						{user?.seller?.store_logo || form.watch('store_logo') ? (
							<img
								src={
									form.watch('store_logo')
										? URL.createObjectURL(form.watch('store_logo') as File)
										: ApiMedia(user?.seller?.store_logo || '')
								}
								alt={user?.seller?.store_name || 'Логотип'}
							/>
						) : (
							<span className={s.text}>Выберите логотип</span>
						)}
						<input
							type='file'
							accept='image/*'
							onChange={handleLogoChange}
							hidden
							id='image'
						/>
					</label>
					<label className={s.changeButton} htmlFor='image'>
						Изменить
					</label>
				</div>
				<FormField
					label='Название магазина'
					name='name'
					error={errors.store_name?.message}
					fullWidth
					className={s.formField}
					field={{
						type: 'text',
						placeholder: 'Введите название магазина',
						register: form.register('store_name')
					}}
				/>
			</div>
			<Button
				type='submit'
				className={s.saveButton}
				loading={isPending}
				disabled={
					isPending ||
					(form.watch('store_name') === user?.seller?.store_name &&
						!form.watch('store_logo'))
				}
				loadingText='Сохранение...'
			>
				Сохранить
			</Button>
			<ErrorList errors={[apiError]} isView={form.formState.isSubmitted} />
		</form>
	);
});

StoreUpdate.displayName = 'StoreUpdate';
