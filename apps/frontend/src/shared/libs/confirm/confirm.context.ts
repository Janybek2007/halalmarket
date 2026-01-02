import { createContext, useContext } from 'react';
import { ConfirmContextValue } from './confirm.types';

export const ConfirmContext = createContext<ConfirmContextValue | undefined>(
	undefined
);

export const useConfirm = () => {
	const context = useContext(ConfirmContext);

	if (!context) {
		throw new Error('useConfirm must be used within a ConfirmProvider');
	}
	return context;
};
