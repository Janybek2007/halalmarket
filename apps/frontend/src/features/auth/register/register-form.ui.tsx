'use client';
import React from 'react';
import { ErrorList } from '~/shared/components/error-list/error-list.ui';
import { FormField } from '~/shared/components/form-field/form-field.ui';
import { Button } from '~/shared/ui/button/button.ui';
import { onPhoneChange } from '~/shared/utils/on-change';
import { useRegisterMutation } from './register.mutation';

export const RegisterForm = React.memo(() => {
	const { apiError, form, isPending, onsubmit } = useRegisterMutation();
	const errors = form.formState.errors;

	return (
		<form onSubmit={onsubmit} data-form>
			<FormField
				label='ФИО'
				name='full_name'
				error={errors.full_name?.message}
				fullWidth
				field={{
					type: 'text',
					placeholder: 'Введите ФИО',
					register: form.register('full_name')
				}}
			/>

			<FormField
				label='Email'
				hint='Пример: example@mail.com'
				name='email'
				error={errors.email?.message}
				fullWidth
				field={{
					type: 'email',
					placeholder: 'Введите свою почту',
					startIcon: 'mdi:email-outline',
					register: form.register('email')
				}}
			/>

			<FormField
				label='Телефон номер'
				name='phone'
				error={errors.phone?.message}
				hint='Пример: +996 700 123 456'
				fullWidth
				field={{
					type: 'tel',
					placeholder: 'Введите свой номер',
					register: form.register('phone', {
						onChange(e) {
							return onPhoneChange(e, value => form.setValue('phone', value));
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
					type: 'password',
					placeholder: 'Придумайте пароль',
					startIcon: 'mdi:lock-outline',
					register: form.register('password'),
					autoComplete: 'off'
				}}
			/>

			<Button
				type='submit'
				fullWidth
				loading={isPending}
				disabled={isPending}
				loadingText='Регистрация...'
			>
				Зарегистрироваться
			</Button>

			<ErrorList errors={[apiError]} isView={form.formState.isSubmitted} />
		</form>
	);
});

RegisterForm.displayName = 'RegisterForm';
