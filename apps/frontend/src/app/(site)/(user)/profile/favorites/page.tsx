'use client';
import { FavoritesProvider, useFavorites } from '~/entities/favorites';
import { State } from '~/shared/components/state/state.ui';

import { Suspense } from 'react';
import { ProductListItem } from '~/entities/products';
import { FavoriteToggleOptionBtn } from '~/features/favorites/toggle';
import { Pagination } from '~/shared/components/pagination/pagination.ui';
import { RoutePaths } from '~/shared/router';
import { Icon } from '~/shared/ui/icon/icon.ui';
import { formatDateCustom } from '~/shared/utils/date';
import styles from './page.module.scss';

export default function Page() {
	return (
		<Suspense>
			<FavoritesProvider>
				<ProfileFavoritesPage />
			</FavoritesProvider>
		</Suspense>
	);
}

function ProfileFavoritesPage() {
	const { favorites, isLoading, pagination } = useFavorites();

	if (isLoading)
		return (
			<State
				icon='line-md:loading-alt-loop'
				title='Загрузка...'
				text='Пожалуйста, подождите'
			/>
		);
	if (!favorites)
		return (
			<State title='Сохраненные' text='Ваш список сохраненных товаров пуст' />
		);

	return (
		<>
			<div className={styles.favoritesPage}>
				<div className={`${styles.container} container`}>
					<div className={styles.header}>
						<h1 className={styles.title}>Сохраненные</h1>
					</div>
					<div className={styles.content}>
						{favorites?.count === 0 ? (
							<State
								icon='material-symbols-light:favorite-outline-rounded'
								title='Сохраненные'
								text='Ваш список сохраненных товаров пуст'
							/>
						) : (
							<>
								<div className={styles.listContainer}>
									{favorites.results.map(fp => (
										<ProductListItem
											key={fp.id}
											date={formatDateCustom(fp.created_at, 'yyyy-MM-dd')}
											products={[fp.product] as any}
											options={[
												{
													label: (
														<>
															<span data-center data-primary>
																Подробнее
															</span>
														</>
													),
													to: RoutePaths.Guest.ProductDetail(fp.product.slug)
												},
												{
													custom: (args, i) => (
														<FavoriteToggleOptionBtn
															key={`favorite-toggle-option-button-${i}`}
															productId={fp.product.id}
															default={true}
															{...args}
														/>
													),
													label: 'favorite-toggle'
												}
											]}
										>
											<div className={styles.favoriteStatus}>
												<div className={styles.statusLabel}>Статус:</div>
												<div className={styles.savedBadge}>
													<Icon c_size={16} name='solar:check-circle-bold' />
													Сохранено
												</div>
											</div>
										</ProductListItem>
									))}
								</div>
								{(favorites?.count || 0) > 3 && (
									<Pagination className={styles.pagination} {...pagination} />
								)}
							</>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
