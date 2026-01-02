'use client';
import React from 'react';
import { SellersQuery } from '~/entities/sellers';
import { useToggle } from '~/shared/hooks';
import { usePaginatedQuery } from '~/shared/libs/pagination';

import { IProduct, ProductListItemv2 } from '~/entities/products';
import { ProductCU } from '~/features/products/cu';
import { ProductDelete } from '~/features/products/seller__delete';
import { Pagination } from '~/shared/components/pagination/pagination.ui';
import { State } from '~/shared/components/state/state.ui';
import { Button } from '~/shared/ui/button/button.ui';
import { Icon } from '~/shared/ui/icon/icon.ui';
import { SellerPageHead } from '~/widgets/seller/seller-page-head/seller-page-head.ui';
import s from './page.module.scss';

export default function SellerProducts() {
	const [openModal, { toggle }] = useToggle();
	const [editdProduct, setEditdProduct] = React.useState<IProduct | null>(null);
	const {
		data: products,
		pagination,
		query: { isLoading }
	} = usePaginatedQuery(SellersQuery.GetStoreProductsQuery, { per_pages: 3 });
	const isThereAreProducts = products && products.count > 0;

	return (
		<main className={s.main}>
			<SellerPageHead
				column={!isThereAreProducts}
				title={!isThereAreProducts ? 'Создание карточки товаров' : 'Товары'}
				action={
					isThereAreProducts ? (
						<button className={s.addProductAction} onClick={toggle}>
							Добавить товар
						</button>
					) : undefined
				}
				endEl={
					!isThereAreProducts ? (
						<Button onClick={toggle} className={s.addProductButton}>
							+ Добавить товар
						</Button>
					) : (
						<h4>
							Количество товаров: <span>{products?.count}</span>
						</h4>
					)
				}
			/>
			<div className='container'>
				{isLoading ? (
					<State
						icon='line-md:loading-alt-loop'
						title='Загрузка...'
						text='Пожалуйста, подождите'
					/>
				) : (
					products?.results?.map(product => (
						<ProductListItemv2 key={product.id} product={product}>
							<div className={s.actions}>
								<Button
									className={`${s.actionButton} ${s.edit}`}
									onClick={() => {
										toggle();
										setEditdProduct(product);
									}}
								>
									<Icon name='octicon:pencil-24' c_size={18} />
									<span>Редактировать</span>
								</Button>
								<ProductDelete
									className={`${s.actionButton} ${s.delete}`}
									product_id={product.id}
								/>
							</div>
						</ProductListItemv2>
					))
				)}
				{(products?.count || 0) > 3 && (
					<Pagination className={s.pagination} {...pagination} />
				)}
			</div>

			{openModal && (
				<ProductCU product={editdProduct ?? undefined} onClose={toggle} />
			)}
		</main>
	);
}
