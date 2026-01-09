'use client';
import { useCart } from '~/entities/cart';
import { State } from '~/shared/components/state/state.ui';
import { DynamycSearchBar } from '~/widgets/search-bar/index.client';

import { ProductListItem } from '~/entities/products';
import { CartSummary } from '~/features/cart/checkout';
import { ProductQuantityControls } from '~/features/cart/product/change-quantity';
import { CartProductDeleteBtn } from '~/features/cart/product/delete';
import { Checkbox } from '~/shared/ui/checkbox/checkbox.ui';
import { formatDateCustom } from '~/shared/utils/date';
import styles from './page.module.scss';

export default function UserCartPage() {
	const cart = useCart(false);

	if (cart?.isLoading)
		return (
			<State
				icon='line-md:loading-alt-loop'
				title='Загрузка...'
				text='Пожалуйста, подождите'
			/>
		);
	return (
		<>
			<DynamycSearchBar />
			<div className={styles.cartPage}>
				<div className={`${styles.container} container`}>
					<div className={styles.header}>
						<h1 className={styles.title}>Корзина</h1>
						<div className={styles.itemCount}>{cart?.totalCount} товара</div>
					</div>
					{!cart?.isEmpty && (
						<div className={styles.selectAll}>
							<Checkbox
								color='color-1'
								checked={(cart?.products || []).every(
									product => product.checked
								)}
								onChecked={() => {
									const allSelected = (cart?.products || []).every(
										product => product.checked
									);
									cart?.onCheckProduct(
										undefined,
										allSelected ? 'uncheck' : 'check'
									);
								}}
								className={styles.selectAllCheckbox}
							/>
							<span className={styles.selectAllLabel}>Выбрать все товары</span>
						</div>
					)}
					<div className={styles.content}>
						<div className={styles.listContainer}>
							{cart?.isEmpty ? (
								<State title='Корзина пуста' text='Добавьте товары в корзину' />
							) : (
								(cart?.products || []).map(item => (
									<ProductListItem
										key={item.id}
										date={formatDateCustom(item.created_at, 'yyyy-MM-dd')}
										products={[item.product]}
										options={[
											{
												custom: (args, i) => (
													<CartProductDeleteBtn
														key={`cart-product-delete-btn-${i}`}
														{...args}
														cartId={item.id}
													/>
												),
												label: 'cart-delete'
											}
										]}
										checkbox={{
											checked: item.checked,
											onChecked: () => cart?.onCheckProduct(item.id),
										}}
									>
										<ProductQuantityControls
											styles={styles}
											cartId={item.id}
											quantity={item.quantity}
										/>
									</ProductListItem>
								))
							)}
						</div>
						{!cart?.isEmpty &&
							(cart?.products || []).some(item => item.checked) && (
								<CartSummary />
							)}
					</div>
				</div>
			</div>
		</>
	);
}
