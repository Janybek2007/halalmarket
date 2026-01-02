'use client';
import React from 'react';
import { ErrorList } from '~/shared/components/error-list/error-list.ui';
import { useToggle } from '~/shared/hooks';
import { Button } from '~/shared/ui/button/button.ui';
import { useResetPasswordMutation } from './reset-pass.mutation';
import { FormField } from '~/shared/components/form-field/form-field.ui'

export const ResetPasswordForm = React.memo((props: { token: string }) => {
	const [showPassword, { toggle: toggleShowPassword }] = useToggle(false);
	const { form, onsubmit, isPending, apiError } = useResetPasswordMutation({
		token: props.token
	});
	const errors = form.formState.errors;
	return (
		<form onSubmit={onsubmit} data-form>
			<FormField
				label='Введите новый пароль'
				name='newPassword'
				error={errors.newPassword?.message}
				fullWidth
				field={{
					type: showPassword ? 'text' : 'password',
					placeholder: 'Введите новый пароль',
					startIcon: 'ic:round-password',
					register: form.register('newPassword'),
					autoComplete: 'off'
				}}
			/>

			<FormField
				label='Подтвердите пароль'
				name='confirmPassword'
				error={errors.confirmPassword?.message}
				fullWidth
				field={{
					type: showPassword ? 'text' : 'password',
					placeholder: 'Подтвердите пароль',
					startIcon: 'ic:round-password',
					register: form.register('confirmPassword'),
					autoComplete: 'off'
				}}
			/>
			<div data-show-password>
				<button type='button' onClick={toggleShowPassword}>
					{showPassword ? 'Скрыть пароль' : 'Показать пароль'}
				</button>
			</div>

			<p data-info-text>
				Введите новый пароль, который будет использоваться для входа в систему
			</p>

			<Button
				type='submit'
				fullWidth
				loading={isPending}
				disabled={isPending}
				loadingText='Сброс пароля...'
			>
				Сбросить пароль
			</Button>

			<ErrorList errors={[apiError]} isView={form.formState.isSubmitted} />
		</form>
	);
});

ResetPasswordForm.displayName = 'ResetPasswordForm';
