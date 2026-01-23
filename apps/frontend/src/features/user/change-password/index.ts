'use client';

import dynamic from 'next/dynamic';

export const ChangePassword = dynamic(
	() =>
		import('./ui/change-password.ui').then(m => ({
			default: m.ChangePassword
		})),
	{ ssr: false }
);
