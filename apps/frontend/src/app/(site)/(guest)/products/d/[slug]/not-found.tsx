import { State } from '~/shared/components/state/state.ui';

export default () => {
	return (
		<div className='container'>
			<State
				title='Товар не найден'
				text='К сожалению, данный товар не существует или был удален. Попробуйте выбрать другой товар или вернуться к списку продуктов.'
			/>
		</div>
	);
};
