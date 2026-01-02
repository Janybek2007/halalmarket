import React from 'react';

import { ConfirmContext } from '../confirm.types';
import s from './styles.module.scss';

interface IProps {
	closeConfirm: VoidFunction;
	context: ConfirmContext | null;
	open: boolean;
}

export const ConfirmContainer: React.FC<IProps> = React.memo(
	({ closeConfirm, context, open }) => {
		React.useEffect(() => {
			if (open) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = 'auto';
			}
			return () => {
				document.body.style.overflow = 'auto';
			};
		}, [open]);

		if (!context || !open) return null;

		const isClose =
			typeof context.isCloseConfirm !== 'undefined'
				? context.isCloseConfirm
				: true;

		return (
			<div className={s.container}>
				<div className={s.confirm}>
					<h2 className={s.title}>{context.title}</h2>
					<p className={s.text}>{context.text}</p>
					<div className={s.buttons}>
						<button
							className={`${s.button} ${s['button--confirm']}`}
							onClick={() => {
								context.confirmCallback?.();
								if (isClose) closeConfirm();
							}}
						>
							{context.confirmText}
						</button>
						<button
							className={`${s.button} ${s['button--cancel']}`}
							onClick={() => {
								context.cancelCallback?.();
								closeConfirm();
							}}
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
