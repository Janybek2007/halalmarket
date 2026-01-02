import { useMutation } from '@tanstack/react-query';
import { SuccessResponse } from '~/global';
import { http } from '~/shared/api/http';
import {
	PushSubscriptionDto,
	PushSubscriptionSchema
} from './subscription.contract';

export const useSubscriptionMutation = () => {
	return useMutation({
		mutationKey: ['notifications-push-subscription'],
		mutationFn: (data: PushSubscriptionDto) => {
			const parsedData = PushSubscriptionSchema.parse(data);
			return http.post<SuccessResponse>(
				'notification/push-subscription/',
				parsedData
			);
		}
	});
};
