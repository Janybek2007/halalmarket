'use client';
import { useEffect } from 'react';
import { useSw } from '~/app/providers/sw';
import { VAPID_PUBLIC_KEY } from '~/shared/constants';
import { useSubscriptionMutation } from './subscription.mutation';

export const useSubscriptionEffect = (
	subscriptionData: object | undefined,
	setIsPushSupported: (supported: boolean) => void,
	setSubscriptionData: (data: object | undefined) => void
) => {
	const { mutateAsync: subscribeToPushMutation } = useSubscriptionMutation();
	const { registration } = useSw();

	useEffect(() => {
		const handleSubscription = async () => {
			if (
				typeof window === 'undefined' ||
				typeof navigator === 'undefined' ||
				!registration ||
				!VAPID_PUBLIC_KEY ||
				subscriptionData
			)
				return;

			const supported = 'serviceWorker' in navigator && 'PushManager' in window;
			setIsPushSupported(supported);
			if (!supported) return;

			try {
				const permission = await Notification.requestPermission();
				if (permission !== 'granted') return;

				const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
				const subscription = await registration.pushManager.subscribe({
					userVisibleOnly: true,
					applicationServerKey
				});

				const newSubscriptionData = {
					info_endpoint: subscription.endpoint,
					info_keys_p256dh: subscription.toJSON().keys?.p256dh || '',
					info_keys_auth: subscription.toJSON().keys?.auth || '',
					browser: navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Other',
					device: window.innerWidth > 768 ? 'Desktop' : 'Mobile'
				};

				await subscribeToPushMutation(newSubscriptionData);
				setSubscriptionData(newSubscriptionData);
				console.log('Push-подписка зарегистрирована');
			} catch (error) {
				console.error('Ошибка push:', error);
			}
		};

		handleSubscription();
	}, [
		registration,
		subscriptionData,
		setIsPushSupported,
		setSubscriptionData,
		subscribeToPushMutation
	]);
};

const urlBase64ToUint8Array = (base64String: string) => {
	const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
	const rawData = typeof window !== 'undefined' ? window.atob(base64) : '';
	const outputArray = new Uint8Array(rawData.length);
	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
};
