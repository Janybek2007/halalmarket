import clsx from 'clsx';
import React from 'react';

import { ApiMedia } from '~/shared/constants';

import Image from 'next/image';
import { IProductReview } from '~/entities/products';
import { Avatar } from '~/shared/ui/avatar/avatar.ui';
import { Icon } from '~/shared/ui/icon/icon.ui';
import styles from './styles.module.scss';

interface IReviewItemProps {
	review: IProductReview;
	extra?: React.ReactNode;
	response?: React.ReactNode;
	is_seller?: boolean;
}

export const ReviewItem = React.memo<IReviewItemProps>(
	({ review, extra, response, is_seller = false }) => {
		return (
			<>
				<div className={styles.reviewItem}>
					{extra}
					<div className={styles.reviewHeader}>
						<div className={styles.reviewerInfo}>
							<Avatar
								src={review.user.avatar}
								placeholder={review.user.full_name[0]}
								alt={review.user.full_name}
								className={styles.reviewerAvatar}
								media
							/>
							<div className={styles.reviewerInfoText}>
								<span className={styles.reviewerName}>
									{review.user.full_name} <br />
								</span>
							</div>
						</div>
						<div className={styles.reviewRating}>
							{[1, 2, 3, 4, 5].map(star => (
								<Icon
									key={star}
									name='material-symbols-light:star'
									className={clsx(styles.star, {
										[styles.activeStar]: star <= review.rating
									})}
								/>
							))}
						</div>
					</div>
					<p
						className={`${styles.reviewText} ${
							review.images.length > 0 && styles.mb
						}`}
					>
						{review.comment}
					</p>

					{Array.isArray(review.images) && review.images.length > 0 && (
						<div className={styles.reviewImages}>
							{review.images.map((image, index) => (
								<picture className={styles.reviewImage} key={index}>
									<Image
										width={100}
										height={100}
										src={ApiMedia(image.image, { w: 100, h: 100 })}
										alt='Отзыв'
									/>
								</picture>
							))}
						</div>
					)}
					{review.seller_response && (
						<div className={styles.sellerResponse}>
							<h3 className={styles.sellerResponseTitle}>
								{is_seller ? 'Ваш ответ' : 'Ответ продавца'}
							</h3>
							<p className={styles.sellerResponseText}>
								{review.seller_response}
							</p>
						</div>
					)}
				</div>
				{response}
			</>
		);
	}
);

ReviewItem.displayName = '_ReviewItem_';
