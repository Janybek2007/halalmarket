'use client';
import React from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from '~/app/providers/session';
import { CreateStore } from '~/features/store/create';
import { ApiMedia } from '~/shared/constants';
import { useToggle } from '~/shared/hooks';
import { RoutePaths } from '~/shared/router';
import { Icon } from '~/shared/ui/icon/icon.ui';
import s from './styles.module.scss';

export const SellerHead: React.FC = React.memo(() => {
	const [open, { toggle }] = useToggle(false);
	const pathname = usePathname();
	const store = useSession().user?.store;

	return (
		<>
			{open && <CreateStore onClose={toggle} />}
			<div className={'container ' + s.sellerHead}>
				{store ? (
					<>
						<div className={s.storeHeader}>
							<div className={s.storeLogo}>
								{store.logo ? (
									<img src={ApiMedia(store.logo)} alt='Store logo' />
								) : (
									<Icon name='carbon:store' c_size={60} />
								)}
							</div>
							<div className={s.storeInfo}>
								<h1>{store.name || 'Название магазина'}</h1>
							</div>
						</div>

						<div className={s.navTabs}>
							{[
								{ path: RoutePaths.Seller.Products, label: 'Товары' },
								{ path: RoutePaths.Seller.Promotions, label: 'Акции' },
								{ path: RoutePaths.Seller.Orders, label: 'Доставки' },
								{ path: RoutePaths.Seller.Reviews, label: 'Отзывы и вопросы' },
								{ path: RoutePaths.Seller.Settings, label: 'Настройки' }
							].map(({ path, label }) => (
								<Link
									key={path}
									href={path}
									className={`${s.navTab} ${pathname === path ? s.active : ''}`}
								>
									{label}
								</Link>
							))}
						</div>
					</>
				) : (
					<button className={s.createStoreBtn} onClick={toggle}>
						+ Создать магазин
					</button>
				)}
			</div>
			<div className='container'>
				<div className={s.divider}></div>
			</div>
		</>
	);
});

SellerHead.displayName = '_SellerHead_';
