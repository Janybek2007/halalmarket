'use client';
import React from 'react';
import { FormProvider } from 'react-hook-form';
import { ErrorList } from '~/shared/components/error-list/error-list.ui';
import { FormField } from '~/shared/components/form-field/form-field.ui';
import { useToggle } from '~/shared/hooks';
import { Button } from '~/shared/ui/button/button.ui';
import { onIdentifierChange } from '~/shared/utils/on-change';
import { useLoginMutation } from './login.mutation';

export const LoginForm = React.memo(() => {
	const [showPassword, { toggle: toggleShowPassword }] = useToggle(false);
	const { form, apiError, isPending, onsubmit } = useLoginMutation();
	const errors = form.formState.errors;

	return (
		<FormProvider {...form}>
			<form onSubmit={onsubmit} data-form>
				<FormField
					label='Email или телефон'
					name='identifier'
					error={errors.identifier?.message}
					hint='Пример: example@mail.com или 996 700 123 456'
					fullWidth
					field={{
						type: 'text',
						placeholder: 'Введите email или телефон',
						startIcon: 'mdi:account-outline',
						register: form.register('identifier', {
							onChange(e) {
								return onIdentifierChange(e, value =>
									form.setValue('identifier', value)
								);
							}
						})
					}}
				/>

				<FormField
					label='Пароль'
					name='password'
					error={errors.password?.message}
					fullWidth
					field={{
						type: showPassword ? 'text' : 'password',
						placeholder: 'Введите свой пароль',
						startIcon: 'mdi:lock-outline',
						register: form.register('password', {}),
						autoComplete: 'off'
					}}
				/>

				<div data-show-password>
					<button type='button' onClick={toggleShowPassword}>
						{showPassword ? 'Скрыть пароль' : 'Показать пароль'}
					</button>
				</div>

				<Button
					type='submit'
					fullWidth
					loading={isPending}
					disabled={isPending}
					loadingText='Вход...'
				>
					Войти
				</Button>

				<ErrorList errors={[apiError]} isView={form.formState.isSubmitted} />
			</form>
		</FormProvider>
	);
});

LoginForm.displayName = 'LoginForm';
