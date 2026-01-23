'use client';
import { PromotionsQuery } from '~/entities/promotion';
import { useToggle } from '~/shared/hooks';
import { usePaginatedQuery } from '~/shared/libs/pagination';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { AddPromotionDrawer } from '~/features/promotions/add';
import { DeletePromotionButton } from '~/features/promotions/seller_delete';
import { Assets } from '~/shared/assets';
import { State } from '~/shared/components/state/state.ui';
import { ApiMedia } from '~/shared/constants';
import { formatDateCustom } from '~/shared/utils/date';
import s from './page.module.scss';

const SellerPageHead = dynamic(() =>
	import('~/widgets/seller/seller-page-head/seller-page-head.ui').then(m => ({
		default: m.SellerPageHead
	}))
);

const Pagination = dynamic(() =>
	import('~/shared/components/pagination/pagination.ui').then(m => ({
		default: m.Pagination
	}))
);

export default function SellerPromotionsPage() {
	const {
		data: promotions,
		query: { isLoading },
		pagination
	} = usePaginatedQuery(PromotionsQuery.GetPromotionsQuery, {
		per_pages: 3
	});

	const [isCreate, { toggle }] = useToggle();

	return (
		<main className={s.main}>
			{isCreate && <AddPromotionDrawer onClose={toggle} />}
			<SellerPageHead
				title={'Акции'}
				action={
					<button className={s.addPromotionAction} onClick={toggle}>
						Добавить акцию
					</button>
				}
			></SellerPageHead>
			<div className='container'>
				{isLoading ? (
					<State
						icon='line-md:loading-alt-loop'
						title='Загрузка...'
						text='Пожалуйста, подождите'
					/>
				) : Number(promotions?.count) === 0 ? (
					<State
						icon='material-symbols:check-rounded'
						title='Нет акций'
						text='Пока что нет акций на ваши товары. Как только покупатели оставят отзывы, они появятся здесь.'
					/>
				) : (
					<div className={s.promotionsList}>
						{promotions?.results?.map(promotion => (
							<div key={promotion.id} className={s.promotionCard}>
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
										<h3 className={s.title}>
											Акция: скидка {promotion.discount}%
										</h3>
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
											<span className={s.discount}>
												Скидка: {promotion.discount}%
											</span>
										</div>
									</div>
									<div className={s.actions}>
										{/* <button className={s.editBtn} title='Редактировать'>
											<Icon name='mdi:pencil' width={20} />
										</button> */}
										<DeletePromotionButton id={promotion.id} />
									</div>
								</div>

								<div className={s.productsSection}>
									<h4 className={s.sectionTitle}>
										Товары в акции ({promotion.products.length})
									</h4>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
			{(promotions?.count || 0) > 3 && (
				<Pagination className={s.pagination} {...pagination} />
			)}
		</main>
	);
}
