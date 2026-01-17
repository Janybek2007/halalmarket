import React from 'react';

import clsx from 'clsx';
import { ErrorList } from '~/shared/components/error-list/error-list.ui';
import { Checkbox } from '~/shared/ui/checkbox/checkbox.ui';
import { ConfirmContext } from '../confirm.types';
import s from './styles.module.scss';

interface IProps {
	closeConfirm: VoidFunction;
	context: ConfirmContext | null;
	open: boolean;
}

export const ConfirmContainer: React.FC<IProps> = React.memo(
	({ closeConfirm, context, open }) => {
		const [error, setError] = React.useState<any>(undefined);
		const [checked, setChecked] = React.useState(false);

		React.useEffect(() => {
			document.body.style.overflow = open ? 'hidden' : 'auto';
			return () => {
				document.body.style.overflow = 'auto';
			};
		}, [open]);

		const handleConfirm = React.useCallback(async () => {
			if (!context) return;
			try {
				setError(undefined);
				await context.confirmCallback?.({ checked });
				closeConfirm();
				setError(null);
			} catch (err: any) {
				setError(err);
			}
		}, [context, error, closeConfirm]);

		const handleCancel = React.useCallback(() => {
			if (!context) return;
			context.cancelCallback?.();
			closeConfirm();
			setError(null);
			setChecked(false);
		}, [context, closeConfirm]);

		if (!context || !open) return null;

		return (
			<div className={s.container}>
				<div className={s.confirm}>
					<h2 className={s.title}>{context.title}</h2>
					<p className={s.text}>{context.text}</p>
					{context.checkBox && context.checkBoxText && (
						<div className={clsx(s.checkboxContainer, error && s.error)}>
							<label
								style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
							>
								<Checkbox
									checked={checked}
									onChecked={() => setChecked(p => !p)}
									color='color-1'
								/>
								<span>{context.checkBoxText}</span>
							</label>
						</div>
					)}

					{error && <ErrorList className={s.errorList} errors={[error]} />}

					<div className={s.buttons}>
						<button
							className={`${s.button} ${s['button--confirm']}`}
							onClick={handleConfirm}
						>
							{context.confirmText}
						</button>

						<button
							className={`${s.button} ${s['button--cancel']}`}
							onClick={handleCancel}
						>
							{context.cancelText}
						</button>
					</div>
				</div>
			</div>
		);
	}
);

ConfirmContainer.displayName = 'ConfirmContainer';
