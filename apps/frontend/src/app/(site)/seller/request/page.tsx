import Link from 'next/link';
import { RequestForm } from '~/features/seller/request';
import { RoutePaths } from '~/shared/router';

export default function SellerRequestPage() {
	return (
		<main className='forms container'>
			<div data-container>
				<h1 data-title data-primary data-seller>
					Открыть магазин
				</h1>

				<p data-info-text data-seller>
					Введите номер WhatsApp для связи с администрацией
				</p>

				<RequestForm />

				<div data-link-actions>
					<Link href={RoutePaths.Guest.Home}>Вернуться на главную</Link>
				</div>
			</div>
		</main>
	);
}
