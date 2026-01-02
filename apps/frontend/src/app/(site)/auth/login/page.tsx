'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { LoginForm } from '~/features/auth/login';
import { RoutePaths } from '~/shared/router';

export default () => {
	return (
		<Suspense>
			<LoginPage />
		</Suspense>
	);
};

function LoginPage() {
	const redirectVal =
		useSearchParams().get('redirect') || RoutePaths.Guest.Home;
	return (
		<div className='forms container'>
			<div data-container>
				<h1 data-title>Войти в систему</h1>

				<LoginForm />

				<div data-link-actions>
					<Link href={RoutePaths.Auth.Forgot}>Забыли пароль?</Link>
					<Link href={RoutePaths.Auth.Register + '?redirect=' + redirectVal}>
						Зарегистрироваться
					</Link>
				</div>
			</div>
		</div>
	);
}
