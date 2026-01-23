'use client';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { SellersQuery } from '~/entities/sellers';
import { ReviewDeleteOptionBtn } from '~/features/reviews/delete';
import { State } from '~/shared/components/state/state.ui';
import { usePaginatedQuery } from '~/shared/libs/pagination';
import { DropdownOption } from '~/shared/ui/dropdown/dropdown.types';
import { Dropdown } from '~/shared/ui/dropdown/dropdown.ui';
import { Icon } from '~/shared/ui/icon/icon.ui';
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

const ReviewItem = dynamic(() =>
	import('~/entities/reviews').then(m => ({
		default: m.ReviewItem
	}))
);

const ReviewResponseForm = dynamic(() =>
	import('~/features/reviews/send-response').then(m => ({
		default: m.ReviewResponseForm
	}))
);

export default function SellerReviewsPage() {
	const sp = useSearchParams();
	const {
		data,
		pagination,
		query: { isLoading }
	} = usePaginatedQuery(SellersQuery.GetReviewsQuery, {
		_to: sp.get('to'),
		per_pages: 3
	});
	const [reply, setReply] = React.useState<number | null>(null);

	return (
		<main className={s.reviewsPage}>
			<SellerPageHead
				title='Отзывы и вопросы'
				endEl={
					<h4>
						Количество отзывов: <span>{data?.count}</span>
					</h4>
				}
			/>
			<div className={clsx('container', s.container)}>
				<div className={s.reviewsList}>
					<>
						{isLoading ? (
							<State
								icon='line-md:loading-alt-loop'
								title='Загрузка...'
								text='Пожалуйста, подождите'
							/>
						) : (data?.count ?? 0) === 0 ? (
							<State
								title='Нет отзывов'
								text='Пока что нет отзывов на ваши товары. Как только покупатели оставят отзывы, они появятся здесь.'
							/>
						) : (
							data?.results?.map(review => (
								<React.Fragment key={review.id}>
									<ReviewItem
										review={review}
										is_seller
										extra={
											<div className={s.extra}>
												<Dropdown
													className={s.dd}
													options={
														[
															!review.seller_response && {
																label: (
																	<>
																		<Icon name='lucide:reply' c_size={18} />
																		<span data-center>Ответить</span>
																	</>
																),
																onClick: () => setReply(review.id)
															},
															{
																label: 'review-delete',
																custom: (args, i) => (
																	<ReviewDeleteOptionBtn
																		{...args}
																		reviewId={review.id}
																		key={`review-delete-option-btn-${i}`}
																	/>
																)
															} as DropdownOption
														].filter(Boolean) as DropdownOption[]
													}
													trigger={({ toggle }) => (
														<button className={s.extraTrigger} onClick={toggle}>
															<Icon
																name='qlementine-icons:menu-dots-16'
																c_size={24}
															/>
														</button>
													)}
												/>
											</div>
										}
										response={
											reply === review.id && (
												<ReviewResponseForm
													close={() => setReply(null)}
													reviewId={reply!}
												/>
											)
										}
									/>
								</React.Fragment>
							))
						)}
					</>
				</div>
				{(data?.count || 0) > 3 && <Pagination {...pagination} />}
			</div>
		</main>
	);
}
