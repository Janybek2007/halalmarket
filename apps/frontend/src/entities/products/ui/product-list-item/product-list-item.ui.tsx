'use client';
import clsx from 'clsx';
import React from 'react';

import Link from 'next/link';
import { ProductImages } from '~/shared/components/product-images/product-images.ui';
import { useSize } from '~/shared/hooks';
import { RoutePaths } from '~/shared/router';
import { Checkbox } from '~/shared/ui/checkbox/checkbox.ui';
import { Dropdown } from '~/shared/ui/dropdown/dropdown.ui';
import { Icon } from '~/shared/ui/icon/icon.ui';
import { discountedPrice, priceFormat } from '~/shared/utils/price';
import { IProduct } from '../../products.types';
import type { ProductListItemProps } from './product-list-item.types';
import styles from './styles.module.scss';

export const ProductListItem = <T extends IProduct>({
	products,
	children,
	checkbox,
	date,
	options = [],
	extra,
	className,
	linkEnable = true,
	priceKey = 'price'
}: ProductListItemProps<T>) => {
	const [height, setHeight] = React.useState('100%');
	const isMoreThenOne = products.length > 1;
	const ref = React.useRef<HTMLDivElement>(null);
	const size = useSize();

	React.useEffect(() => {
		if (ref.current) {
			setHeight(ref.current.clientHeight + 'px');
		}
	}, [ref]);

	const AsName = linkEnable ? Link : 'h5';

	return (
		<div className={clsx(styles.productItem, className)}>
			<div ref={ref} className={styles.leftSection}>
				{products.map(product => (
					<div
						key={product.id}
						className={clsx(styles.product, isMoreThenOne && styles.ismore)}
					>
						<ProductImages
							classNames={{
								container: styles.imageContainer,
								image: styles.image
							}}
							mediaOpts={{ w: 170, h: 185 }}
							images={product.images}
							alt={product.name}
						/>
						<div
							className={styles.content}
							// style={
							// 	size.width >= 560
							// 		? {
							// 				// height:
							// 				// 	Number(height.split('px')[0]) > 300 ? 'auto' : height
							// 				height: 'auto'
							// 		  }
							// 		: {}
							// }
						>
							<div
								className={clsx(styles.header, linkEnable && styles.linkEnable)}
							>
								<AsName
									href={RoutePaths.Guest.ProductDetail(product.slug)}
									className={styles.name}
								>
									{product.name}
								</AsName>
								<div className={styles.price}>
									<span>
										{priceFormat(
											discountedPrice(product[priceKey as 'price'] , product.discount),
											'сом'
										)}
									</span>{' '}
								</div>
							</div>

							{typeof children === 'function' ? children(product) : children}
						</div>
					</div>
				))}
			</div>
			<div
				className={styles.rightSection}
				style={size.width >= 560 ? { height } : {}}
			>
				{options.length > 0 && (
					<Dropdown
						options={
							typeof options === 'function' ? options(products[0]) : options
						}
						trigger={({ toggle }) => (
							<button onClick={toggle} className={styles.moreTrigger}>
								<Icon name='icon-park-outline:more' />
							</button>
						)}
						className={styles.dd}
					/>
				)}
				{checkbox && (
					<div className={styles.checkbox}>
						<Checkbox
							color='color-1'
							checked={checkbox.checked ?? false}
							onChecked={checked => checkbox.onChecked(checked)}
							className={styles.checkboxInput}
						/>
					</div>
				)}
				{date && (
					<div className={styles.date}>
						Дата: <span>{date}</span>
					</div>
				)}
				{extra}
			</div>
		</div>
	);
};
