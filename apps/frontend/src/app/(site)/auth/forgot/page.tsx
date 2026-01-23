'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Suspense } from 'react';
import { RoutePaths } from '~/shared/router';

export default () => {
	return (
		<Suspense>
			<ForgotPage />
		</Suspense>
	);
};

const ForgotForm = dynamic(() =>
	import('~/features/auth/forgot').then(m => ({
		default: m.ForgotForm
	}))
);

function ForgotPage() {
	return (
		<div className='forms container'>
			<div data-container>
				<h1 data-title>Восстановление пароля!</h1>
				<ForgotForm />
				<div data-link-actions>
					<Link href={RoutePaths.Auth.Login}>Вернуться к входу</Link>
				</div>
			</div>
		</div>
	);
}
