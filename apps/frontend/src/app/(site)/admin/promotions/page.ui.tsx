'use client';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { PromotionsQuery } from '~/entities/promotion';
import { State } from '~/shared/components/state/state.ui';
import { usePaginatedQuery } from '~/shared/libs/pagination';
import s from './page.module.scss';

const Pagination = dynamic(() =>
	import('~/shared/components/pagination/pagination.ui').then(m => ({
		default: m.Pagination
	}))
);

const PromotionCard = dynamic(() =>
	import('~/entities/promotion').then(m => ({
		default: m.PromotionCard
	}))
);

export default function AdminPromotionsPage() {
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
