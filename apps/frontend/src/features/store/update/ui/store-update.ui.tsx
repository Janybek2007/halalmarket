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
							[s.hasLogo]: user?.store?.logo || form.watch('logo')
						})}
					>
						{user?.store?.logo || form.watch('logo') ? (
							<img
								src={
									form.watch('logo')
										? URL.createObjectURL(form.watch('logo') as File)
										: ApiMedia(user?.store?.logo || '')
								}
								alt={user?.store?.name || 'Логотип'}
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
					error={errors.name?.message}
					fullWidth
					className={s.formField}
					field={{
						type: 'text',
						placeholder: 'Введите название магазина',
						register: form.register('name')
					}}
				/>
			</div>
			<Button
				type='submit'
				className={s.saveButton}
				loading={isPending}
				disabled={
					isPending ||
					(form.watch('name') === user?.store?.name && !form.watch('logo'))
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
