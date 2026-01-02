'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { PromotionCard, PromotionsQuery } from '~/entities/promotion';
import { Pagination } from '~/shared/components/pagination/pagination.ui';
import { State } from '~/shared/components/state/state.ui';
import { usePaginatedQuery } from '~/shared/libs/pagination';
import s from './page.module.scss';

export default () => {
	return (
		<Suspense>
			<AdminPromotionsPage />
		</Suspense>
	);
};

function AdminPromotionsPage() {
	const _to = useSearchParams().get('_to');
	const {
		data,
		query: { isLoading },
		pagination
	} = usePaginatedQuery(PromotionsQuery.GetPromotionsQuery, {
		_to,
		per_pages: 3
	});

	return (
		<main className={s.promotionsPage}>
			{isLoading ? (
				<State
					icon='line-md:loading-alt-loop'
					title='Загрузка...'
					text='Пожалуйста, подождите'
				/>
			) : Number(data?.count) === 0 ? (
				<State
					title='Нет акций'
					text='В данный момент нет акций для рассмотрения.'
				/>
			) : (
				<div className={s.promotionsList}>
					{(data?.results || []).map(promotion => (
						<PromotionCard key={promotion.id} promo={promotion} />
					))}
				</div>
			)}

			{(data?.count || 0) > 5 && (
				<Pagination className={s.pagination} {...pagination} />
			)}
		</main>
	);
}
