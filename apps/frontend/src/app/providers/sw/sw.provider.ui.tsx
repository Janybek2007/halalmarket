'use client';

import React, { useEffect, useState } from 'react';
import { SWContext } from './sw.context';

export const SWProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const [isRegistered, setIsRegistered] = React.useState(false);
	const [registration, setRegistration] =
		useState<ServiceWorkerRegistration | null>(null);

	useEffect(() => {
		if (typeof navigator === 'undefined' && typeof window === 'undefined')
			return;
		if ('serviceWorker' in navigator) {
			const registerSW = async () => {
				try {
					const reg = await navigator.serviceWorker.register(
						'/service-worker.js'
					);
					setIsRegistered(true);
					setRegistration(reg);
				} catch (error) {
					console.error('Service Worker registration failed:', error);
				}
			};

			registerSW();
		}
	}, []);

	return (
		<SWContext.Provider value={{ isRegistered, registration }}>
			{children}
		</SWContext.Provider>
	);
};
