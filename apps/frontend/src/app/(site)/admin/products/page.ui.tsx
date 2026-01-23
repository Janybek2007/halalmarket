'use client';
import { queryOptions } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { ProductService, TGetProductsListParams } from '~/entities/products';
import { DatePicker } from '~/shared/components/date-picker/date-picker.ui';
import { State } from '~/shared/components/state/state.ui';
import { useQueryString } from '~/shared/hooks';
import { useDatePicker } from '~/shared/hooks/use-date-picker';
import { usePaginatedQuery } from '~/shared/libs/pagination';
import { Tabs } from '~/shared/ui/tabs/tabs.ui';
import { DeleteProducts, ModerationProducts } from '~/widgets/admin/products';
import s from './page.module.scss';

const Pagination = dynamic(() =>
	import('~/shared/components/pagination/pagination.ui').then(m => ({
		default: m.Pagination
	}))
);

export default function AdminProductsPage() {
	const [tab, setTab] = useQueryString('_tab', 'moderation');
	const _to = useSearchParams().get('_to');
	const datePicker = useDatePicker();

	const {
		data: products,
		query: { isLoading },
		pagination
	} = usePaginatedQuery(
		(params: TGetProductsListParams) =>
			queryOptions({
				queryKey: ['get-products_admin', params],
				queryFn: () => ProductService.GetProductList(params)
			}),
		{
			start_date: datePicker.startDate.value,
			end_date: datePicker.endDate.value,
			_to,
			per_pages: 12
		}
	);

	return (
		<main className={s.main}>
			<div className={s.filter}>
				<Tabs
					tabs={[
						{
							label: 'Модерация товаров',
							value: 'moderation'
						},
						{
							label: 'Удаление запрещенных товаров',
							value: 'delete'
						}
					]}
					activeTab={tab || 'moderation'}
					onChange={setTab}
				/>
				<DatePicker className={s.datePicker} {...datePicker} />
			</div>
			{isLoading ? (
				<State
					icon='line-md:loading-alt-loop'
					title='Загрузка...'
					text='Пожалуйста, подождите'
				/>
			) : products?.count === 0 ? (
				<State
					icon={'solar:document-broken'}
					title={'Нет товаров'}
					text={'К сожалению, товары по вашему запросу не найдены.'}
				/>
			) : (
				<>
					{tab === 'moderation' && products && (
						<ModerationProducts products={products} />
					)}
					{tab === 'delete' && products && (
						<DeleteProducts products={products} />
					)}
					{Number(products?.count) > 12 && <Pagination {...pagination} />}
				</>
			)}
		</main>
	);
}
