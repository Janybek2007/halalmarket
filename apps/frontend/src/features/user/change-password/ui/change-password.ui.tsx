import React from 'react';

import { useToggle } from '~/shared/hooks/use-toggle';

import { ErrorList } from '~/shared/components/error-list/error-list.ui';
import { FormField } from '~/shared/components/form-field/form-field.ui';
import { Button } from '~/shared/ui/button/button.ui';
import { Drawer } from '~/shared/ui/drawer/drawer.ui';
import { useChangePasswordMutation } from '../change-password.mutation';
import s from './styles.module.scss';

interface IChangePassword {
	onClose: VoidFunction;
}

export const ChangePassword: React.FC<IChangePassword> = React.memo(
	({ onClose }) => {
		const { apiError, form, onsubmit } = useChangePasswordMutation(onClose);
		const [showPassword, { toggle: toggleShowPassword }] = useToggle();
		const errors = form.formState.errors;

		return (
			<Drawer
				onClose={onClose}
				className={s.drawer}
				header={<h4 className={s.headerTitle}>Изменить пароль</h4>}
			>
				<div className={s.content}>
					<form className={s.form} onSubmit={onsubmit}>
						<FormField
							label='Старый пароль*'
							name='old_password'
							error={errors.old_password?.message}
							fullWidth
							className={s.formField}
							field={{
								type: showPassword ? 'text' : 'password',
								placeholder: 'Введите старый пароль',
								register: form.register('old_password'),
								variant: 'filled',
								autoComplete: 'off'
							}}
						/>

						<FormField
							label='Новый пароль*'
							name='new_password'
							error={errors.new_password?.message}
							fullWidth
							className={s.formField}
							field={{
								type: showPassword ? 'text' : 'password',
								placeholder: 'Введите новый пароль',
								register: form.register('new_password'),
								variant: 'filled',
								autoComplete: 'off'
							}}
						/>

						<FormField
							label='Подтверждение пароля*'
							name='confirmPassword'
							error={errors.confirm_password?.message}
							fullWidth
							className={s.formField}
							field={{
								type: showPassword ? 'text' : 'password',
								placeholder: 'Подтвердите новый пароль',
								register: form.register('confirm_password'),
								variant: 'filled',
								autoComplete: 'off'
							}}
						/>

						<div>
							<button
								className={s.showPasswordButton}
								type='button'
								onClick={toggleShowPassword}
							>
								{showPassword ? 'Скрыть пароль' : 'Показать пароль'}
							</button>
						</div>

						<div className={s.buttonGroup}>
							<Button
								type='submit'
								className={s.saveButton}
								loadingText='Сохранение...'
							>
								Сохранить
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

ChangePassword.displayName = 'ChangePassword';
