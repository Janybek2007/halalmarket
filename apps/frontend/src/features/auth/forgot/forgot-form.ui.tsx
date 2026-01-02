'use client'
import React from 'react';
import { ErrorList } from '~/shared/components/error-list/error-list.ui';
import { Button } from '~/shared/ui/button/button.ui';
import { FormField } from '~/shared/components/form-field/form-field.ui';
import { useForgotMutation } from './forgot.mutation';

export const ForgotForm = React.memo(() => {
	const { apiError, form, isPending, onsubmit } = useForgotMutation();
	const errors = form.formState.errors;
	return (
		<form onSubmit={onsubmit} data-form>
			<FormField
				label='Email'
				name='email'
				hint='Пример: example@mail.com'
				error={errors.email?.message}
				fullWidth
				field={{
					type: 'email',
					placeholder: 'Введите свою почту',
					startIcon: 'mdi:email-outline',
					register: form.register('email')
				}}
			/>

			<p data-info-text>
				На указанную электронную почту придёт письмо с ссылкой по восстановлению
				пароля
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

ForgotForm.displayName = 'ForgotForm';
