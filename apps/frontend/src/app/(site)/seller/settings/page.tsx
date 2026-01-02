'use client';
import { StoreUpdate } from '~/features/store/update';
import s from './page.module.scss';

export default function SellerSettingsPage() {
	return (
		<main className={s.main}>
			<div className={`${s.container} container`}>
				<StoreUpdate />

				{/* <div className={s.danger}>
					<h2 className={s.title}>Зона риска</h2>
					<Button className={s.delete}>Удалить магазин</Button>
				</div> */}
			</div>
		</main>
	);
}
