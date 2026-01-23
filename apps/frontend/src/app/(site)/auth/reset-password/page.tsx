'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { RoutePaths } from '~/shared/router';

export default () => {
	return (
		<Suspense>
			<ResetPasswordPage />
		</Suspense>
	);
};

const ResetPasswordForm = dynamic(() =>
	import('~/features/auth/reset-password').then(m => ({
		default: m.ResetPasswordForm
	}))
);

function ResetPasswordPage() {
	const token = useSearchParams().get('token');

	return (
		<div className='forms container'>
			<div data-container>
				<h1 data-title>Сброс пароля</h1>

				<ResetPasswordForm token={String(token)} />
				<div data-link-actions>
					<Link href={RoutePaths.Auth.Login}>Вернуться к входу</Link>
				</div>
			</div>
		</div>
	);
}
