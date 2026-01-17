'use client';
import { usePathname } from 'next/navigation';
import { State } from '~/shared/components/state/state.ui';
import { isSellerOnlyOutlet } from '~/shared/utils/access-allowed';
import { AppHeader } from '~/widgets/app/header';
import { AppTabs } from '~/widgets/app/tabs';
import { SellerHead } from '~/widgets/seller/seller-head/seller-head.ui';
import { useSession } from '../../providers/session';

export default function SellerLayout(props: React.ViewTransitionProps) {
	const pathname = usePathname();
	const { user: profile } = useSession();
	if (isSellerOnlyOutlet(pathname)) return props.children;
	const isActive = !profile?.seller ? null : profile?.seller?.status === 'active';
	const isBlocked = !profile?.seller ? null : profile?.seller?.status === 'blocked';
	return (
		<>
			{isActive ? (
				<>
					<AppHeader />
					<SellerHead />
					{profile?.seller?.store_name ? (
						props.children
					) : (
						<State
							icon='carbon:store'
							title='У вас нет магазина'
							text='Создайте магазин, чтобы начать продавать товары'
						/>
					)}
				</>
			) : (
				<>
					<AppHeader />
					{isBlocked && (
						<State
							icon='line-md:alert-circle'
							title='Ваш аккаунт продавца заблокирован'
							text='Ваш аккаунт продавца временно заблокирован. Обратитесь в службу поддержки для получения дополнительной информации о причинах блокировки и дальнейших действиях.'
						/>
					)}
				</>
			)}
			<AppTabs />
		</>
	);
}
