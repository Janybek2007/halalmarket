'use client';
import dynamic from 'next/dynamic';

const SetProfileForm = dynamic(() =>
	import('~/features/seller/set-profile').then(m => ({
		default: m.SetProfileForm
	}))
);

export default function SellerSetProfilePage({}) {
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
