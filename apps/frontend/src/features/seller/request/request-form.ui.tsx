'use client';
import React from 'react';
import { ErrorList } from '~/shared/components/error-list/error-list.ui';
import { FormField } from '~/shared/components/form-field/form-field.ui';
import { Button } from '~/shared/ui/button/button.ui';
import { onPhoneChange } from '~/shared/utils/on-change';
import { useSellerRequestMutation } from './request.mutation';

export const RequestForm = React.memo(() => {
	const { apiError, form, isPending, onsubmit } = useSellerRequestMutation();
	const errors = form.formState.errors;
	return (
		<form onSubmit={onsubmit} data-form>
			<FormField
				label='Телефон'
				name='phone'
				error={errors.phone?.message}
				hint='Пример: +996 700 123 456'
				fullWidth
				field={{
					type: 'tel',
					placeholder: '996 xxx xxx xxx',
					register: form.register('phone', {
						onChange(e) {
							return onPhoneChange(e, value => form.setValue('phone', value));
						}
					})
				}}
			/>

			<Button
				type='submit'
				fullWidth
				loading={isPending}
				disabled={isPending}
				loadingText='Отправка заявки...'
			>
				Отправить заявку
			</Button>

			<ErrorList errors={[apiError]} isView={form.formState.isSubmitted} />
		</form>
	);
});

RequestForm.displayName = 'RequestForm';
