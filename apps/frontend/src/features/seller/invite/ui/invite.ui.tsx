import React from 'react';
import { toast } from 'sonner';
import { ErrorList } from '~/shared/components/error-list/error-list.ui';
import { FormField } from '~/shared/components/form-field/form-field.ui';
import { useClickAway, useToggle } from '~/shared/hooks';
import { Button } from '~/shared/ui/button/button.ui';
import { onPhoneChange } from '~/shared/utils/on-change';
import { useSellerInviteMutation } from '../invite.mutation';
import s from './styles.module.scss';

const SellerInvite: React.FC<{ onClose: VoidFunction }> = React.memo(
	({ onClose }) => {
		const [inviteUrl, setInviteUrl] = React.useState<string | null>(null);

		const contentRef = useClickAway<HTMLDivElement>(onClose);

		const { form, apiError, isPending, onsubmit } = useSellerInviteMutation(
			onClose,
			setInviteUrl
		);
		const errors = form.formState.errors;

		const copyToClipboard = React.useCallback(() => {
			if (!inviteUrl) return;
			navigator.clipboard.writeText(inviteUrl).then(() => {
				toast.success('Ссылка скопирована в буфер обмена');
			});
		}, [inviteUrl]);

		return (
			<div className={s.popover} ref={contentRef}>
				<form onSubmit={onsubmit}>
					<h3 className={s.popoverTitle}>Создать приглашение</h3>

					<div className={s.formFields}>
						<FormField
							label='Телефон'
							name='phone'
							error={errors.phone?.message}
							hint='Введите номер телефона для отправки приглашения'
							fullWidth
							field={{
								type: 'tel',
								placeholder: '+996 XXX XXX XXX',
								register: form.register('phone', {
									onChange(e) {
										return onPhoneChange(e, value =>
											form.setValue('phone', value)
										);
									}
								})
							}}
						/>

						<FormField
							label='Email (необязательно)'
							name='email'
							error={errors.email?.message}
							hint='Можно указать, чтобы сразу отправить приглашение на почту'
							fullWidth
							field={{
								type: 'email',
								placeholder: 'example@mail.com',
								register: form.register('email')
							}}
						/>
					</div>

					<div className={s.buttonGroup}>
						<Button
							type='submit'
							fullWidth
							loading={isPending}
							disabled={isPending}
							loadingText='Отправка приглашения...'
						>
							Создать приглашение
						</Button>
						<Button
							type='button'
							fullWidth
							onClick={() => {
								form.reset();
								setInviteUrl(null);
								onClose();
							}}
						>
							Отмена
						</Button>
					</div>

					<ErrorList errors={[apiError]} isView={form.formState.isSubmitted} />
				</form>

				{inviteUrl && (
					<div className={s.inviteUrlContainer}>
						<input
							type='button'
							readOnly
							onClick={copyToClipboard}
							value={inviteUrl}
							className={s.inviteUrlInput}
						/>
					</div>
				)}
			</div>
		);
	}
);

export const SellerInviteWrapper: React.FC = React.memo(() => {
	const [open, { toggle }] = useToggle();
	return (
		<>
			<div style={{ position: 'relative', display: 'inline-block' }}>
				<Button onClick={toggle} className={s.actionsCellButton}>
					Добавить продавца
				</Button>
				{open && <SellerInvite onClose={toggle} />}
			</div>
		</>
	);
});

SellerInvite.displayName = 'SellerInvite';
SellerInviteWrapper.displayName = 'SellerInviteWrapper';
