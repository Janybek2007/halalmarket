'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { ResetPasswordForm } from '~/features/auth/reset-password';
import { RoutePaths } from '~/shared/router';

export default () => {
	return (
		<Suspense>
			<ResetPasswordPage />
		</Suspense>
	);
};

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
