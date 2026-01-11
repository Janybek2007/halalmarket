'use client';
import React from 'react';
import { IPromotion } from '../../promotion.types';

import { PromotionDeleteBtn } from '~/features/promotions/admin__delete';
import { PromotionUpdateStatusBtns } from '~/features/promotions/update-status/update-status.ui';
import { Assets } from '~/shared/assets';
import { ApiMedia } from '~/shared/constants';
import { formatDateCustom } from '~/shared/utils/date';
import s from './styles.module.scss';
import Image from 'next/image'

export const PromotionCard: React.FC<{ promo: IPromotion }> = React.memo(
	({ promo: promotion }) => {
		const showStatusButtons =
			promotion.status === 'pending' && !promotion.is_expired;

		return (
			<div className={s.promotionCard}>
				<div className={s.promotionHeader}>
					<Image
						width={100}
						height={100}
						src={
							ApiMedia(promotion.thumbnail, { w: 100, h: 100 }) ||
							Assets.Placeholder
						}
						alt='Акция'
						className={s.thumbnail}
					/>
					<div className={s.info}>
						<h3 className={s.title}>Акция: скидка {promotion.discount}%</h3>
						<div className={s.seller}>
							<span className={s.label}>Продавец:</span>{' '}
							{promotion.seller.user.full_name} ({promotion.seller.user.email})
						</div>
						<div className={s.dates}>
							{promotion.is_expired ? (
								<span>
									Истекла{' '}
									{formatDateCustom(
										new Date(promotion.expires_at),
										'dd.MM.yyyy HH:mm'
									)}
								</span>
							) : (
								<span>
									Действует до{' '}
									{formatDateCustom(
										new Date(promotion.expires_at),
										'dd.MM.yyyy HH:mm'
									)}
								</span>
							)}
						</div>
						<div className={s.statusWrapper}>
							<span
								className={`${s.status} ${s[promotion.status]} ${
									promotion.is_expired ? s.expired : ''
								}`}
							>
								{promotion.status === 'pending' && 'На рассмотрении'}
								{promotion.status === 'active' && 'Активна'}
								{promotion.status === 'rejected' && 'Отклонена'}
								{promotion.is_expired && 'Истекла'}
							</span>
							<span className={s.discount}>Скидка: {promotion.discount}%</span>
						</div>
					</div>
					<div className={s.actions}>
						{showStatusButtons && (
							<PromotionUpdateStatusBtns
								classNames={{ approve: s.approveBtn, reject: s.rejectBtn }}
								promotionId={promotion.id}
							/>
						)}
						<PromotionDeleteBtn
							className={s.deleteBtn}
							promotionId={promotion.id}
						/>
					</div>{' '}
				</div>
				<div className={s.productsSection}>
					<h4 className={s.sectionTitle}>
						Товары в акции ({promotion.products.length})
					</h4>
				</div>
			</div>
		);
	}
);

PromotionCard.displayName = '_PromotionCard_';
