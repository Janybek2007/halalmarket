'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { ErrorList } from '~/shared/components/error-list/error-list.ui';
import { FormField } from '~/shared/components/form-field/form-field.ui';
import { useToggle } from '~/shared/hooks';
import { RoutePaths } from '~/shared/router';
import { Button } from '~/shared/ui/button/button.ui';
import { useSetProfileMutation } from './set-profile.mutation';

export const SetProfileForm: React.FC = React.memo(() => {
	const token = useSearchParams().get('token');

	const [showPassword, { toggle: toggleShowPassword }] = useToggle();
	const { apiError, form, isPending, onsubmit } = useSetProfileMutation();
	const errors = form.formState.errors;
	const router = useRouter();

	React.useEffect(() => {
		if (token) {
			form.setValue('token', token);
		} else {
			router.push(RoutePaths.Guest.Home);
		}
	}, [token]);

	return (
		<form onSubmit={onsubmit} data-form>
			<FormField
				label='ФИО'
				name='fullname'
				error={errors.fullname?.message}
				fullWidth
				field={{
					type: 'text',
					placeholder: 'Введите ФИО',
					register: form.register('fullname')
				}}
			/>

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

			<FormField
				label='Пароль'
				name='password'
				error={errors.password?.message}
				fullWidth
				field={{
					type: showPassword ? 'text' : 'password',
					placeholder: 'Введите пароль',
					register: form.register('password'),
					autoComplete: 'off'
				}}
			/>

			<FormField
				label='Подтверждение пароля'
				name='confirm_password'
				error={errors.confirm_password?.message}
				fullWidth
				field={{
					type: showPassword ? 'text' : 'password',
					placeholder: 'Подтвердите пароль',
					register: form.register('confirm_password'),
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
				loadingText='Установка профиля...'
			>
				Установить профиль
			</Button>

			<div data-link-actions>
				<button
					type='button'
					onClick={() => router.push(RoutePaths.Guest.Home)}
				>
					Вернуться на главную
				</button>
			</div>

			<ErrorList errors={[apiError]} isView={form.formState.isSubmitted} />
		</form>
	);
});

SetProfileForm.displayName = 'SetProfileForm';
