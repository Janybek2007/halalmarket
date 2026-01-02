'use client';
import { createContext, useContext } from 'react';
import { SessionValue } from './session.types';

export const SessionContext = createContext<SessionValue | undefined>(
	undefined
);

export const useSession = () => {
	const context = useContext(SessionContext);
	if (!context) {
		throw new Error('useSession must be used within a SessionProvider');
	}
	return context;
};
