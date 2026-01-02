'use client';
import { Suspense } from 'react';
import { SetProfileForm } from '~/features/seller/set-profile';

export default () => {
	return (
		<Suspense>
			<SellerSetProfilePage />
		</Suspense>
	);
};

function SellerSetProfilePage({}) {
	return (
		<main className='forms container'>
			<div data-container>
				<h1 data-title data-primary data-seller>
					Установка профиля
				</h1>

				<p data-info-text data-seller>
					Установите профиль для вашего аккаунта
				</p>

				<SetProfileForm />
			</div>
		</main>
	);
}
