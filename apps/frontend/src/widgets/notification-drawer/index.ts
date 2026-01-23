import dynamic from 'next/dynamic';

export const DynamicNotificationDrawer = dynamic(
	() => import('./notification-drawer.ui'),
	{ ssr: false }
);
