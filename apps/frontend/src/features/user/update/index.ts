'use client';

import dynamic from 'next/dynamic';

export const UpdateProfileDrawer = dynamic(
	() =>
		import('./ui/update-profile.ui').then(m => ({
			default: m.UpdateProfileDrawer
		})),
	{ ssr: false }
);
