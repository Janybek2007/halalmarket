'use client';
import React from 'react';
import { Toaster } from 'sonner';
import { ConfirmProvider } from '~/shared/libs/confirm';
import { ReactQueryProvider } from '~/shared/libs/tanstack';
import { SessionProvider } from './providers/session';

export function LayoutClient(props: React.PropsWithChildren) {
	return (
		<ReactQueryProvider>
			<Toaster
				duration={3000}
				position='top-center'
				richColors
				className='_toaster'
			/>
			<ConfirmProvider>
				<SessionProvider>{props.children}</SessionProvider>
			</ConfirmProvider>
		</ReactQueryProvider>
	);
}
