'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { RegisterForm } from '~/features/auth/register';
import { RoutePaths } from '~/shared/router';

export default () => {
	return (
		<Suspense>
			<RegisterPage />
		</Suspense>
	);
};

function RegisterPage() {
	const redirectVal =
		useSearchParams().get('redirect') || RoutePaths.Guest.Home;
	return (
		<div className='forms container'>
			<div data-container>
				<h1 data-title>Регистрация</h1>
				<RegisterForm />
				<div data-link-actions>
					<Link href={RoutePaths.Auth.Login + '?redirect=' + redirectVal}>
						Уже есть аккаунт?
					</Link>
				</div>
			</div>
		</div>
	);
}
