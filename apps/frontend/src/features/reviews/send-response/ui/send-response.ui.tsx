import React from 'react';

import { Button } from '~/shared/ui/button/button.ui';
import { useSendResponseMutation } from '../send-response.mutation';
import s from './styles.module.scss';

interface IProps {
	reviewId: number;
	close: VoidFunction;
}

export const ReviewResponseForm: React.FC<IProps> = React.memo(
	({ reviewId, close: onClose }) => {
		const { onSubmit, response, setResponse, isPending } =
			useSendResponseMutation(onClose, reviewId);

		return (
			<form className={s.reply} onSubmit={onSubmit}>
				<div className={s.replyInput}>
					<label htmlFor='reply'>Ваш ответ</label>
					<textarea
						id='reply'
						value={response}
						rows={4}
						autoFocus
						disabled={isPending}
						placeholder='Напишите что - нибудь'
						onChange={e => setResponse(e.target.value)}
					/>
				</div>
				<div className={s.actions}>
					<Button disabled={response.length === 0 || isPending} type='submit'>
						Ответить
					</Button>
					<Button onClick={onClose} variant='outline'>
						Закрыть
					</Button>
				</div>
			</form>
		);
	}
);

ReviewResponseForm.displayName = 'ReviewResponseForm ';
