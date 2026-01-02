'use client';
import { useRouter } from 'next/navigation';
import { RoutePaths } from '~/shared/router';
import { Icon } from '~/shared/ui/icon/icon.ui';
import s from './layout.module.scss';

export default function AuthLayout(props: React.PropsWithChildren) {
	const router = useRouter();
	return (
		<main className={s.main}>
			<button
				className={s.backButton}
				onClick={() => router.push(RoutePaths.Guest.Home)}
			>
				<Icon name='lucide:chevron-left' />
				Вернуться на главную
			</button>
			{props.children}
		</main>
	);
}
