import React from 'react';

import { useSession } from '~/app/providers/session';
import { ErrorList } from '~/shared/components/error-list/error-list.ui';
import { FormField } from '~/shared/components/form-field/form-field.ui';
import { Avatar } from '~/shared/ui/avatar/avatar.ui';
import { Button } from '~/shared/ui/button/button.ui';
import { Drawer } from '~/shared/ui/drawer/drawer.ui';
import { Icon } from '~/shared/ui/icon/icon.ui';
import { onPhoneChange } from '~/shared/utils/on-change';
import { useUserUpdateMutation } from '../user-update.mutation';
import s from './styles.module.scss';

export const UpdateProfileDrawer: React.FC<{ onClose: VoidFunction }> = React.memo(
	({ onClose }) => {
		const { user: profile } = useSession();
		const {
			form,
			onsubmit,
			selectedFile,
			setSelectedFile,
			apiError,
			apiError2
		} = useUserUpdateMutation();
		const errors = form.formState.errors;

		return (
			<Drawer
				header={<h4 className={s.headerTitle}>Редактирование профиля</h4>}
				onClose={onClose}
				className={s.updateProfileContainer}
			>
				<div className={s.updateProfileCard}>
					<form className={s.form} onSubmit={onsubmit}>
						<div className={s.avatarSection}>
							<div className={s.avatarContainer}>
								<Avatar
									src={
										selectedFile
											? URL.createObjectURL(selectedFile)
											: profile?.avatar
									}
									placeholder={profile?.full_name[0]}
									alt='profile'
									className={s.avatar}
									media={!!profile?.avatar && !selectedFile}
								/>
							</div>
							<label htmlFor='avatar' className={s.uploadPhotoButton}>
								<input
									id='avatar'
									type='file'
									accept='image/*'
									hidden
									onChange={e => setSelectedFile(e.target.files?.[0] || null)}
								/>
								Загрузите новое фото
								<Icon name='mingcute:upload-line' className={s.uploadIcon} />
							</label>
						</div>

						<FormField
							label='ФИО'
							name='full_name'
							error={errors.full_name?.message}
							fullWidth
							className={s.formField}
							field={{
								type: 'text',
								placeholder: 'Введите ваше ФИО',
								register: form.register('full_name'),
								variant: 'filled'
							}}
						/>

						<FormField
							label='Email'
							name='email'
							error={errors.email?.message}
							hint='Пример: example@mail.com'
							fullWidth
							className={s.formField}
							field={{
								type: 'email',
								placeholder: 'Введите ваш email',
								register: form.register('email'),
								variant: 'filled'
							}}
						/>

						<FormField
							label='Адрес'
							name='address'
							error={errors.address?.message}
							fullWidth
							className={s.formField}
							field={{
								type: 'text',
								placeholder: 'Введите ваш адрес',
								register: form.register('address'),
								variant: 'filled'
							}}
						/>

						<FormField
							label='Телефон'
							name='phone'
							error={errors.phone?.message}
							hint='Пример: +996 700 123 456'
							fullWidth
							className={s.formField}
							field={{
								type: 'tel',
								placeholder: 'Введите ваш телефон',
								register: form.register('phone', {
									onChange(e) {
										return onPhoneChange(e, value =>
											form.setValue('phone', value)
										);
									}
								}),
								variant: 'filled'
							}}
						/>

						<Button
							type='submit'
							fullWidth
							className={s.saveButton}
							loading={form.formState.isSubmitting}
							disabled={form.formState.isSubmitting}
							loadingText='Сохранение...'
						>
							Сохранить
						</Button>

						<ErrorList
							errors={[apiError, apiError2]}
							isView={form.formState.isSubmitted}
						/>
					</form>
				</div>
			</Drawer>
		);
	}
);

UpdateProfileDrawer.displayName = 'UpdateProfileDrawer';
