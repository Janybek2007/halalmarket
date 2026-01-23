'use client';
import clsx from 'clsx';
import React from 'react';

import { queryOptions } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { ProductService, TProductReviewResult } from '~/entities/products';
import { ReviewItem } from '~/entities/reviews';
import { State } from '~/shared/components/state/state.ui';
import { usePaginatedQuery } from '~/shared/libs/pagination';
import { Button } from '~/shared/ui/button/button.ui';
import { Icon } from '~/shared/ui/icon/icon.ui';
import s from './styles.module.scss';

interface ProductReviewsProps {
	average_rating: number;
	slug: string;
	initialReviews: TProductReviewResult | null;
}

export const Pagination = dynamic(
	() =>
		import('~/shared/components/pagination/pagination.ui').then(m => ({
			default: m.Pagination
		})),
	{
		ssr: false
	}
);

export const ProductReviews: React.FC<ProductReviewsProps> = ({
	average_rating,
	slug,
	initialReviews
}) => {
	const { data, pagination } = usePaginatedQuery(
		params =>
			queryOptions({
				queryKey: ['get-reviews_product', slug, params],
				queryFn: () =>
					ProductService.GetProductReviews({ slug: slug, ...params }),
				initialData: initialReviews
			}),
		{ per_pages: 6, scrollInHandle: false }
	);
	const queryData = data || {
		results: [],
		count: 0
	};
	if ((queryData as any)._page_out_of_range)
		return (
			<State
				icon='lucide:message-circle-warning'
				title='Запрошенная страница вне диапазона.'
				text='Запрошенная страница находится вне допустимого диапазона. Пожалуйста, вернитесь на предыдущую страницу.'
			/>
		);

	if (!queryData.results)
		return (
			<State
				icon='lucide:message-square'
				title='Нет отзывов'
				text='Пока что нет отзывов на этот товар. Как только покупатели оставят отзывы, они появятся здесь.'
			/>
		);
	return (
		<section className={s.productReviews}>
			<div className={s.reviewsList}>
				<div className={s.reviewsHeader}>
					<h1 className={s.reviewsTitle}>
						Оценки
						<sup className={s.reviewsCount}>{queryData?.count}</sup>
					</h1>
					<div className={s.overallRating}>
						{Array.from({ length: 5 }, (_, index) => (
							<Icon
								key={index}
								name='material-symbols-light:star'
								className={clsx(s.star, {
									[s.activeStar]: index + 1 <= Number(average_rating)
								})}
							/>
						))}
						<span className={s.ratingValue}>
							{parseFloat(String(average_rating)).toFixed(1)}
						</span>
					</div>
				</div>

				{queryData.results.length > 0 ? (
					queryData.results.map(review => (
						<ReviewItem key={review.id} review={review} />
					))
				) : (
					<State
						icon='lucide:message-square'
						title='Нет отзывов'
						text='Пока что нет отзывов на этот товар. Как только покупатели оставят отзывы, они появятся здесь.'
					/>
				)}

				{queryData?.count > 6 && <Pagination {...pagination} />}
			</div>
		</section>
	);
};

export const LoadReviewsButton: React.FC<{
	setLimit: React.Dispatch<React.SetStateAction<number>>;
}> = React.memo(({ setLimit }) => {
	return (
		<Button
			className={s.loadReviewsButton}
			onClick={() => setLimit(prev => prev + 6)}
		>
			Загрузтить отзывы
		</Button>
	);
});
