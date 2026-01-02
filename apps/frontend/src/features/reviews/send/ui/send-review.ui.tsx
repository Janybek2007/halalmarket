'use client';

import clsx from 'clsx';
import React from 'react';

import Link from 'next/link';
import { useSession } from '~/app/providers/session';
import { Assets } from '~/shared/assets';
import { RoutePaths } from '~/shared/router';
import { Button } from '~/shared/ui/button/button.ui';
import { Icon } from '~/shared/ui/icon/icon.ui';
import { useSendReviewMutation } from '../review-send.mutation';
import styles from './styles.module.scss';

export const SendReviewForm: React.FC<{
	slug: string;
}> = React.memo(({ slug }) => {
	const { form, handleRemovePhoto, handleUpload, onsubmit } =
		useSendReviewMutation(slug);
	const { user: profile } = useSession();
	const errors = form.formState.errors;

	return (
		<div className={styles.reviewSection}>
			<div className={clsx(styles.reviewWrapper, !profile && styles.disabled)}>
				<div className={styles.flex}>
					<h2 className={styles.reviewTitle}>Оценить:</h2>
					<div className={styles.ratingStars}>
						{[1, 2, 3, 4, 5].map(star => (
							<button
								key={`star-key-${star}`}
								onClick={() => form.setValue('rating', star)}
							>
								<Icon
									name='material-symbols-light:star'
									className={clsx(styles.star, {
										[styles.activeStar]: star <= (form.watch('rating') || 0)
									})}
								/>
							</button>
						))}
					</div>
				</div>
				{errors.rating && (
					<p className={styles.error}>{errors.rating.message}</p>
				)}
			</div>

			<form
				onSubmit={onsubmit}
				className={clsx(styles.commentForm, !profile && styles.disabled)}
			>
				<div className={styles.cmFormTop}>
					<textarea
						className={clsx(
							styles.commentInput,
							errors.comment && styles.error
						)}
						placeholder={
							errors.comment ? errors.comment.message : 'Написать комментарий'
						}
						{...form.register('comment')}
					/>

					<div className={styles.uploadPhotoSection}>
						<label htmlFor='file' className={styles.uploadPhotoButton}>
							<span>Загрузите новое фото</span>
							<img src={Assets.FileSvg} alt='file' />
							<input
								type='file'
								accept='image/*'
								hidden
								id='file'
								multiple
								max={4}
								disabled={Number(form.watch('files')?.length) > 4}
								onClick={e =>
									Number(form.watch('files')?.length) > 4
										? e.preventDefault()
										: undefined
								}
								onChange={handleUpload}
							/>
						</label>

						<div className={styles.photoPreviewContainer}>
							{Array.from({ length: 4 }).map((_, index) => (
								<div
									key={index}
									className={clsx(
										styles.photoPreview,
										form.watch('files')?.[index] && styles.there
									)}
								>
									<img
										src={
											form.watch('files')?.[index]
												? URL.createObjectURL(form.watch('files')?.[index]!)
												: Assets.CameraCard
										}
										alt='file'
									/>
									{form.watch('files')?.[index] && (
										<button
											type='button'
											className={styles.deletePhotoButton}
											onClick={() => handleRemovePhoto(index)}
										>
											<Icon name='material-symbols:delete-outline' />
										</button>
									)}
								</div>
							))}
						</div>
					</div>
				</div>

				<div className={styles.bottom}>
					<Button className={styles.submitButton} type='submit'>
						Добавить
					</Button>
				</div>
			</form>
			{!profile && (
				<p className={styles.unauthorized}>
					Вы должны быть авторизованы, чтобы оставить отзыв
					<Link href={RoutePaths.Auth.Login}>Войти</Link>
				</p>
			)}
		</div>
	);
});

SendReviewForm.displayName = 'SendReviewForm';
