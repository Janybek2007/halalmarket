'use client';
import s from './page.module.scss';
import dynamic from 'next/dynamic'

const StoreUpdate = dynamic(() =>
	import('~/features/store/update').then(m => ({
		default: m.StoreUpdate
	}))
);


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
