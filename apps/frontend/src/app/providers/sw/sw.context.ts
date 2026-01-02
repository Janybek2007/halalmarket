'use client';
import { createContext, useContext } from 'react';
import { SWContextValue } from './sw.types';

export const SWContext = createContext<SWContextValue | undefined>(undefined);

export const useSw = () => {
	const context = useContext(SWContext);

	if (!context) {
		throw new Error('useSw must be used within a SWProvider');
	}

	return context;
};
