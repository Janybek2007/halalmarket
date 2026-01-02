import React from 'react';
import { useToggle } from '~/shared/hooks';
import { ConfirmContext } from './confirm.context';
import { ConfirmContext as TConfirmContext } from './confirm.types';
import { ConfirmContainer } from './ui/confirm-container.ui';

export const ConfirmProvider: React.FC<React.PropsWithChildren> = props => {
	const [open, { set }] = useToggle();
	const [context, setContext] = React.useState<TConfirmContext | null>(null);

	const openConfirm = React.useCallback(
		(ctx: TConfirmContext) => {
			setContext(ctx);
			set(true);
		},
		[set]
	);

	const closeConfirm = React.useCallback(() => {
		setContext(null);
		set(false);
	}, [set]);

	return (
		<ConfirmContext.Provider value={{ openConfirm }}>
			<ConfirmContainer
				context={context}
				open={open}
				closeConfirm={closeConfirm}
			/>
			{props.children}
		</ConfirmContext.Provider>
	);
};
