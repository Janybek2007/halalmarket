import { State } from '~/shared/components/state/state.ui';

export default () => {
	return (
		<div className='container'>
			<State
				title='Категория не найдена'
				text='К сожалению, данная категория не существует или была удалена. Попробуйте выбрать другую категорию.'
			/>
		</div>
	);
};
